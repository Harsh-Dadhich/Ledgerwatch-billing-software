from datetime import datetime, timezone
import secrets

import jwt
from fastapi import HTTPException, Response, status
from mongoengine.errors import NotUniqueError

from app.auth.payload import (
    LoginPayload,
    OwnerSignupPayload,
    StaffCreatePayload,
    Updatestaff,
    UserOut,
)
from app.core.cache import blacklist_jti, is_jti_blacklisted
from app.core.config import settings
from app.core.logger import get_logger
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.models.user import Store, User

from app.core.config import settings
from app.core.email import send_email
from app.core.logger import get_logger
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.models.user import Store, User

logger = get_logger(__name__)

COOKIE_KWARGS = {
    "httponly": True,
    "secure": settings.is_production,
    # "samesite": "strict",
    "samesite": "none" if settings.is_production else "strict",
    "path": "/",
}


def set_auth_cookies(response: Response, user: User) -> None:
    access_token, _ = create_access_token(str(user.id), user.role, str(user.store.id))
    refresh_token, _ = create_refresh_token(str(user.id))

    response.set_cookie(
        "access_token", access_token,
        max_age=settings.access_token_expire_minutes * 60,
        **COOKIE_KWARGS,
    )
    print("Refresh token value:", refresh_token)

    refresh = response.set_cookie(
        "refresh_token", refresh_token,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        **COOKIE_KWARGS,
    )

def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def to_user_out(user: User) -> UserOut:
    return UserOut(
        id=str(user.id), name=user.name, email=user.email,
        role=user.role, store_id=str(user.store.id), is_active=user.is_active,
    )


def signup_owner(payload: OwnerSignupPayload) -> User:
    """Creates a new Store and its first admin user.

    There is deliberately no public 'sign up as sales staff' -- that would
    let anyone register themselves as an employee of any store. Staff
    accounts are created via create_staff() by an existing admin instead.
    """
    store = Store(name=payload.store_name).save()
    try:
        user = User(
            name=payload.name,
            email=payload.email.lower(),
            password_hash=hash_password(payload.password),
            role="admin",
            store=store,
        ).save()
    except NotUniqueError:
        store.delete()  # roll back the orphaned store
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    logger.info("New store signup: store=%s admin=%s", store.id, user.email)
    return user


def create_staff(payload: StaffCreatePayload, store_id: str) -> User:
    store = Store.objects(id=store_id).first()
    if store is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")

    try:
        user = User(
            name=payload.name,
            email=payload.email.lower(),
            password_hash=hash_password(payload.password),
            role="sales",
            store=store,
        ).save()
    except NotUniqueError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    logger.info("Staff account created: store=%s user=%s", store_id, user.email)
    return user

def get_staff_by_store(store_id: str) -> list[UserOut]:
    store = Store.objects(id=store_id).first()
    if store is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")

    # staff_users = User.objects(store=store, role="sales", is_active=True)
    staff_users = User.objects(store=store, role="sales")
    return [to_user_out(user) for user in staff_users]

def update_staff(user_id: str, payload: Updatestaff, store_id: str) -> None:
    user = User.objects(id=user_id, store=store_id, role="sales").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff user not found")

    user.name = payload.name
    user.email = payload.email
    # user.is_active = False  # Soft delete
    user.save()
    logger.info("Staff account deactivated: store=%s user=%s", store_id, user.email)

def delete_staff(user_id: str, store_id: str) -> None:
    user = User.objects(id=user_id, store=store_id, role="sales").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff user not found")

    user.is_active = False
    user.save()
    logger.info("Staff account deactivated: store=%s user=%s", store_id, user.email)

def reactivate_staff(user_id: str, store_id: str) -> User:
    user = User.objects(id=user_id, store=store_id, role="sales").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff user not found")

    user.is_active = True
    user.save()
    logger.info("Staff account reactivated: store=%s user=%s", store_id, user.email)
    return user

def authenticate(payload: LoginPayload) -> User:
    user = User.objects(email=payload.email.lower(), is_active=True).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        # Same error for "no such user" and "wrong password" -- don't leak which one.
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return user


def get_user_by_id(user_id: str) -> User:
    user = User.objects(id=user_id, is_active=True).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def _remaining_ttl_seconds(exp_timestamp: int) -> int:
    return max(0, exp_timestamp - int(datetime.now(timezone.utc).timestamp()))


def rotate_refresh_token(refresh_token_cookie: str | None, response: Response) -> User:
    """Verifies the actual refresh_token cookie (not just a still-valid
    access token), rejects it if revoked, issues a fresh pair, and
    revokes the old refresh token so it can't be replayed.
    """
    if refresh_token_cookie is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    try:
        payload = decode_token(refresh_token_cookie)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    if is_jti_blacklisted(payload["jti"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")

    user = get_user_by_id(payload["sub"])

    # Rotation: this refresh token is now single-use. Blacklist it so a
    # stolen/replayed copy can't be reused after a legitimate refresh.
    blacklist_jti(payload["jti"], _remaining_ttl_seconds(payload["exp"]))

    set_auth_cookies(response, user)
    return user


def logout(access_token_cookie: str | None, refresh_token_cookie: str | None, response: Response) -> None:
    for token in (access_token_cookie, refresh_token_cookie):
        if not token:
            continue
        try:
            payload = decode_token(token)
            blacklist_jti(payload["jti"], _remaining_ttl_seconds(payload["exp"]))
        except jwt.PyJWTError:
            pass  # already invalid/expired -- nothing to revoke

    clear_auth_cookies(response)



from app.auth.payload import (
    ForgotPasswordPayload,
    LoginPayload,
    OwnerSignupPayload,
    ResetPasswordPayload,
    StaffCreatePayload,
    UserOut,
)
from app.core.cache import (
    blacklist_jti,
    delete_password_reset_token,
    get_user_id_for_reset_token,
    is_jti_blacklisted,
    set_password_reset_token,
)


def request_password_reset(payload: ForgotPasswordPayload) -> None:
    """Always behaves the same way to the caller regardless of whether the
    email exists -- the route returns one generic message either way, so
    this endpoint can't be used to check which emails are registered.
    """
    user = User.objects(email=payload.email.lower(), is_active=True).first()
    if user is None:
        logger.info("Password reset requested for unknown email: %s", payload.email)
        return

    token = secrets.token_urlsafe(32)
    set_password_reset_token(token, str(user.id))

    reset_link = f"{settings.frontend_url}/?reset_token={token}"
    send_email(
        to=user.email,
        subject="Reset your Ledgerwatch password",
        body=(
            f"Hi {user.name},\n\n"
            f"Click the link below to reset your password. This link expires in 30 minutes.\n\n"
            f"{reset_link}\n\n"
            f"If you didn't request this, you can ignore this email."
        ),
    )
    logger.info("Password reset token issued for user=%s", user.email)


def reset_password(payload: ResetPasswordPayload) -> None:
    user_id = get_user_id_for_reset_token(payload.token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link")

    user = User.objects(id=user_id, is_active=True).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link")

    user.password_hash = hash_password(payload.new_password)
    user.save()

    delete_password_reset_token(payload.token)
    logger.info("Password reset completed for user=%s", user.email)