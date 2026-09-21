from datetime import datetime, timezone

from mongoengine import (
    BooleanField,
    DateTimeField,
    Document,
    ReferenceField,
    StringField,
)

from app.models.user import Store, User


class Brand(Document):
    name = StringField(required=True, max_length=100)
    description = StringField(required=False)

    store = ReferenceField(Store, required=True)
    created_by = ReferenceField(User)

    is_active = BooleanField(default=True)

    created_at = DateTimeField(
        default=lambda: datetime.now(timezone.utc)
    )

    meta = {
        "collection": "brands",
        "indexes": [
            {"fields": ["store", "name"], "unique": True},
            {"fields": ["store", "is_active"]},
        ],
    }