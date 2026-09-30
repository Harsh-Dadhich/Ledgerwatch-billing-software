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
    # name = StringField(required=True, max_length=200)
    # price = FloatField(required=True, min_value=0)
    # quantity = FloatField(required=False, default=None )
    # store = ReferenceField(Store, required=True)
    # created_by = ReferenceField(User)
    # is_active = BooleanField(default=True)
    # created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    name = StringField(required=True, max_length=200)
    sku = StringField(unique=True, sparse=True)
    barcode = StringField(unique=True, sparse=True)
    category = StringField()
    brand = StringField()
    purchase_price = FloatField(min_value=0)
    price = FloatField(required=True, min_value=0)
    mrp = FloatField(min_value=0)
    gst_pct = FloatField(default=0, min_value=0)
    quantity = FloatField(required=False, default=None)
    min_stock = FloatField(default=5, min_value=0)
    store = ReferenceField(Store, required=True)
    created_by = ReferenceField(User)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(
        default=lambda: datetime.now(timezone.utc)
    )

    meta = {
        "collection": "products",
        "indexes": [
            "name",
            "sku",
            "barcode",
            "category",
            "brand",
            {"fields": ["store", "is_active"]},
        ],
    }
