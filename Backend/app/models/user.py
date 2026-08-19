from datetime import datetime, timezone

from mongoengine import (
    BooleanField,
    DateTimeField,
    Document,
    EmailField,
    IntField,
    ReferenceField,
    StringField,
)


class Store(Document):
    name = StringField(required=True, max_length=200)
    # Atomically incremented per bill -- see bills/service.py.
    # Using a counter on the Store document (rather than counting
    # existing bills) means numbering survives bills being deleted later
    # and never has to scan the bills collection to figure out "next".
    bill_sequence = IntField(default=0)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {"collection": "stores"}


class User(Document):
    ROLE_CHOICES = ("admin", "sales")

    name = StringField(required=True, max_length=120)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    role = StringField(required=True, choices=ROLE_CHOICES)
    store = ReferenceField(Store, required=True)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        "collection": "users",
        "indexes": ["email", "store"],
    }
