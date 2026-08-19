from mongoengine import connect, disconnect

from app.core.config import settings


def init_db() -> None:
    connect(host=settings.mongo_uri)


def close_db() -> None:
    disconnect()
