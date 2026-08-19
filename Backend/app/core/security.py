from datetime import datetime, timedelta, timezone
from typing import Literal
import uuid

import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TokenType = Literal["access", "refresh"]


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def _create_token(subject: str, token_type: TokenType, extra_claims: dict | None = None) -> tuple[str, str]:
    """Returns (token, jti). jti lets refresh tokens be revoked individually via Redis/DB later."""
    now = datetime.now(timezone.utc)
    if token_type == "access":
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    else:
        expires_delta = timedelta(days=settings.refresh_token_expire_days)

    jti = str(uuid.uuid4())
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
        "jti": jti,
    }
    if extra_claims:
        payload.update(extra_claims)

    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return token, jti


def create_access_token(user_id: str, role: str, store_id: str) -> tuple[str, str]:
    return _create_token(user_id, "access", {"role": role, "store_id": store_id})


def create_refresh_token(user_id: str) -> tuple[str, str]:
    return _create_token(user_id, "refresh")


def decode_token(token: str) -> dict:
    """Raises jwt.PyJWTError subclasses on invalid/expired tokens — caught by the caller."""
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
