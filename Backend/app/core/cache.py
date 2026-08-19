import json

import redis

from app.core.config import settings

redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)


# ---------- refresh-token revocation ----------
# Each refresh token carries a unique jti (see core/security.py). Revoking
# a token means recording its jti here until it would have expired anyway
# -- after that Redis drops the key itself, no cleanup job needed.

def blacklist_jti(jti: str, ttl_seconds: int) -> None:
    if ttl_seconds <= 0:
        return
    redis_client.setex(f"revoked_jti:{jti}", ttl_seconds, "1")


def is_jti_blacklisted(jti: str) -> bool:
    return redis_client.exists(f"revoked_jti:{jti}") == 1


# ---------- bill creation idempotency ----------
# If a client's request times out or retries after a dropped connection,
# this stops the same "Finalize bill" tap from creating two bills.
# Client sends the same idempotency_key on a retry; we return the
# original result instead of creating a duplicate.

IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60  # 24 hours is plenty for a retry window


def get_idempotent_result(store_id: str, key: str) -> dict | None:
    raw = redis_client.get(f"bill_idem:{store_id}:{key}")
    return json.loads(raw) if raw else None


def set_idempotent_result(store_id: str, key: str, result: dict) -> None:
    redis_client.setex(
        f"bill_idem:{store_id}:{key}",
        IDEMPOTENCY_TTL_SECONDS,
        json.dumps(result),
    )


# ---------- password reset tokens ----------
PASSWORD_RESET_TTL_SECONDS = 30 * 60  # 30 minutes


def set_password_reset_token(token: str, user_id: str) -> None:
    redis_client.setex(f"pwreset:{token}", PASSWORD_RESET_TTL_SECONDS, user_id)


def get_user_id_for_reset_token(token: str) -> str | None:
    return redis_client.get(f"pwreset:{token}")


def delete_password_reset_token(token: str) -> None:
    redis_client.delete(f"pwreset:{token}")