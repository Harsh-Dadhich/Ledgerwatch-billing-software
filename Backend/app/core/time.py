from datetime import datetime, timezone
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")


def to_ist_iso(dt: datetime) -> str:
    """Converts a stored UTC datetime to IST and serializes it with an
    explicit +05:30 offset, so the frontend can display it as-is with no
    further timezone conversion needed.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(IST).isoformat()


def start_of_ist_day_utc(reference: datetime | None = None) -> datetime:
    """Returns the UTC instant corresponding to midnight IST "today".
    Used for "today's sales" style queries.
    """
    now_ist = (reference or datetime.now(timezone.utc)).astimezone(IST)
    start_ist = now_ist.replace(hour=0, minute=0, second=0, microsecond=0)
    return start_ist.astimezone(timezone.utc)