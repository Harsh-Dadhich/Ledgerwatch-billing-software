from datetime import datetime, timezone

from mongoengine import (
    DateTimeField,
    Document,
    FloatField,
    ReferenceField,
    StringField,
)

from app.core.enums import StockTransactionType
from app.models.product import Product
from app.models.user import Store, User


class StockTransaction(Document):

    product = ReferenceField(
        Product,
        required=True,
    )

    store = ReferenceField(
        Store,
        required=True,
    )

    transaction_type = StringField(
        required=True,
        choices=[t.value for t in StockTransactionType],
    )

    quantity = FloatField(
        required=True,
        min_value=0,
    )

    notes = StringField(
        required=False,
    )

    created_by = ReferenceField(
        User,
    )

    created_at = DateTimeField(
        default=lambda: datetime.now(timezone.utc)
    )

    meta = {
        "collection": "stock_transactions",
        "indexes": [
            "product",
            "transaction_type",
            {"fields": ["store", "-created_at"]},
            {"fields": ["product", "-created_at"]},
        ],
    }