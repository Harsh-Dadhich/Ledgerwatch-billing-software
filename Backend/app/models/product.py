from datetime import datetime, timezone

from mongoengine import (
    BooleanField,
    DateTimeField,
    Document,
    FloatField,
    ReferenceField,
    StringField,
)

from app.models.user import Store, User


class Product(Document):
    name = StringField(required=True, max_length=200)
    price = FloatField(required=True, min_value=0)
    quantity = FloatField(required=False, default=None )
    store = ReferenceField(Store, required=True)
    created_by = ReferenceField(User)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        "collection": "products",
        "indexes": [
            "name",
            {"fields": ["store", "is_active"]},
        ],
    }
