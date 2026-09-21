from enum import Enum


class PaymentMethod(str, Enum):
    """Shared across the Bill model, request payload, and response schema
    so the list of valid payment methods exists in exactly one place.

    Inherits from str so it works as a plain string wherever one is
    expected (MongoEngine's StringField, JSON serialization) while still
    giving real validation -- Pydantic rejects anything outside these
    three values with a 422, and your editor autocompletes them.
    """
    CASH = "cash"
    ONLINE = "online"
    DUE = "due"

class StockTransactionType(str, Enum):
    OPENING = "OPENING"
    PURCHASE = "PURCHASE"
    SALE = "SALE"
    ADJUSTMENT = "ADJUSTMENT"
    DAMAGE = "DAMAGE"