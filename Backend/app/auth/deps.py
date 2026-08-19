import jwt
from fastapi import Cookie, Depends, HTTPException, status

from app.core.cache import is_jti_blacklisted
from app.core.security import decode_token
from app.models.user import Store, User


class CurrentUser:
    """Lightweight holder built straight from the JWT payload.

    We deliberately avoid a DB hit on every request for the common case --
    role and store_id are trusted claims inside a token we signed ourselves.
    Routes that need the live User document fetch it explicitly.
    """

    def __init__(self, user_id: str, role: str, store_id: str):
        self.user_id = user_id
        self.role = role
        self.store_id = store_id


def get_current_user(access_token: str | None = Cookie(default=None)) -> CurrentUser:
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_token(access_token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    # Without this check, logging out wouldn't actually end a session --
    # the access token would keep working for up to its remaining
    # lifetime (15 min) even after /auth/logout revoked it.
    if is_jti_blacklisted(payload["jti"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session revoked")

    return CurrentUser(
        user_id=payload["sub"],
        role=payload["role"],
        store_id=payload["store_id"],
    )


def require_admin(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


def get_current_store(current_user: CurrentUser = Depends(get_current_user)) -> Store:
    store = Store.objects(id=current_user.store_id).first()
    if store is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")
    return store
