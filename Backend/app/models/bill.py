from datetime import datetime, timezone

from mongoengine import (
    BooleanField,
    DateTimeField,
    Document,
    EmbeddedDocument,
    EmbeddedDocumentListField,
    FloatField,
    IntField,
    ReferenceField,
    StringField,
)

from app.models.product import Product
from app.models.user import Store, User


class BillLineItem(EmbeddedDocument):
    product = ReferenceField(Product, required=True)
    # Snapshotted at time of sale so editing/deleting a product later
    # never changes the historical record of what was actually sold.
    name = StringField(required=True)
    unit_price = FloatField(required=True, min_value=0)
    quantity = IntField(required=True, min_value=1)
    discount_pct = FloatField(default=0, min_value=0, max_value=100)
    line_total = FloatField(required=True, min_value=0)


class Bill(Document):
    bill_number = StringField(required=True, unique=True)
    store = ReferenceField(Store, required=True)
    salesperson = ReferenceField(User, required=True)
    items = EmbeddedDocumentListField(BillLineItem, required=True)
    subtotal = FloatField(required=True, min_value=0)  # sum of line totals, before bill-level discount
    bill_discount_pct = FloatField(default=0, min_value=0, max_value=100)
    grand_total = FloatField(required=True, min_value=0)  # subtotal after bill-level discount
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    # Voiding, not deleting: a bill is a financial record. "Deleting" a
    # mistaken or cancelled sale still needs to leave an audit trail --
    # this is the same pattern as Product's is_active soft-delete.
    is_voided = BooleanField(default=False)
    voided_at = DateTimeField(default=None)
    voided_by = ReferenceField(User, default=None)

    meta = {
        "collection": "bills",
        "indexes": [
            "bill_number",
            "salesperson",
            {"fields": ["store", "-created_at"]},
        ],
    }
