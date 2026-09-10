from fastapi import APIRouter, Cookie, Depends, Request, Response, status

from app.auth import service
from app.auth.deps import CurrentUser, get_current_user, require_admin
from app.auth.payload import LoginPayload, OwnerSignupPayload, StaffCreatePayload, Updatestaff, UserOut
from app.core.limiter import limiter
from app.auth.payload import EncryptedRequest, EncryptedResponse
from app.core.encryption import decrypt_request, encrypt_response
from app.core.keys import server_public_pem

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/public-key")
def get_public_key():
    return {"public_key": server_public_pem}

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def owner_signup(request: Request, payload: OwnerSignupPayload, response: Response):
    user = service.signup_owner(payload)
    service.set_auth_cookies(response, user)
    return service.to_user_out(user)


@router.post("/staff", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_staff(payload: StaffCreatePayload, current_user: CurrentUser = Depends(require_admin)):
    user = service.create_staff(payload, current_user.store_id)
    return service.to_user_out(user)


@router.get("/staff", response_model=list[UserOut])
def get_staff(current_user: CurrentUser = Depends(require_admin)):
    return service.get_staff_by_store(current_user.store_id)

@router.put("/staff/{user_id}", response_model=UserOut)
def update_staff(user_id: str, payload: Updatestaff, current_user: CurrentUser = Depends(require_admin)):
    user =service.update_staff(user_id, payload, current_user.store_id)
    return service.to_user_out(user)

@router.delete("/staff/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(user_id: str, current_user: CurrentUser = Depends(require_admin)):
    service.delete_staff(user_id, current_user.store_id)

@router.post("/staff/{user_id}/reactivate", response_model=UserOut)
def reactivate_staff(user_id: str, current_user: CurrentUser = Depends(require_admin)):
    user = service.reactivate_staff(user_id, current_user.store_id)
    return service.to_user_out(user)

# @router.post("/login", response_model=UserOut)
# @limiter.limit("10/minute")
# def login(request: Request, payload: LoginPayload, response: Response):
#     user = service.authenticate(payload)
#     service.set_auth_cookies(response, user)
#     return service.to_user_out(user)

@router.post("/login", response_model=EncryptedResponse)
@limiter.limit("10/minute")
def login(request: Request, encrypted_req: EncryptedRequest, response: Response):
    data, aes_key = decrypt_request(encrypted_req)
    payload = LoginPayload(email=data["email"], password=data["password"])

    user = service.authenticate(payload)
    service.set_auth_cookies(response, user)

    return encrypt_response(service.to_user_out(user).model_dump(), aes_key)


@router.post("/refresh")
def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
):
    # Verifies the actual refresh_token cookie -- checks signature,
    # expiry, and the revocation list -- then rotates it. A still-valid
    # access token alone is no longer enough to refresh.
    user = service.rotate_refresh_token(refresh_token, response)
    return {"status": "refreshed"}


@router.post("/logout")
def logout(
    response: Response,
    access_token: str | None = Cookie(default=None),
    refresh_token: str | None = Cookie(default=None),
):
    # Actually revokes both tokens (adds their jti to the Redis
    # blacklist) instead of just clearing cookies client-side.
    service.logout(access_token, refresh_token, response)
    return {"status": "logged out"}


@router.get("/me", response_model=UserOut)
def me(current_user: CurrentUser = Depends(get_current_user)):
    user = service.get_user_by_id(current_user.user_id)
    return service.to_user_out(user)

from app.auth.payload import LoginPayload, OwnerSignupPayload, StaffCreatePayload, UserOut
from app.auth.payload import (
    ForgotPasswordPayload,
    LoginPayload,
    OwnerSignupPayload,
    ResetPasswordPayload,
    StaffCreatePayload,
    UserOut,
)

@router.post("/forgot-password")
@limiter.limit("3/minute")
def forgot_password(request: Request, payload: ForgotPasswordPayload):
    service.request_password_reset(payload)
    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password")
@limiter.limit("5/minute")
def reset_password(request: Request, payload: ResetPasswordPayload):
    service.reset_password(payload)
    return {"message": "Password updated. You can now log in."}