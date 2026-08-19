from pydantic import BaseModel, Field


class BillLineItemPayload(BaseModel):
    product_id: str
    quantity: int = Field(ge=1)
    # Discount is optional and off by default -- applied only when the
    # salesperson explicitly chooses to, never inherited from the product.
    discount_pct: float = Field(default=0, ge=0, le=100)
    # Optional price override for this line, e.g. a negotiated price at the
    # counter. If omitted, the product's current catalogue price is used.
    unit_price: float | None = Field(default=None, gt=0)


class BillCreatePayload(BaseModel):
    items: list[BillLineItemPayload] = Field(min_length=1)
    # Applied to the subtotal after all line items, e.g. a final
    # "round it off" or loyalty discount -- separate from per-line discounts.
    bill_discount_pct: float = Field(default=0, ge=0, le=100)
    # Optional. If the client retries the same "finalize bill" tap (e.g.
    # after a dropped connection), sending the same key returns the
    # original bill instead of creating a duplicate. Generate a fresh
    # random value per bill attempt on the frontend (e.g. crypto.randomUUID()).
    idempotency_key: str | None = Field(default=None, max_length=100)


class BillLineItemOut(BaseModel):
    product_id: str
    name: str
    unit_price: float
    quantity: int
    discount_pct: float
    line_total: float


class BillOut(BaseModel):
    id: str
    bill_number: str
    salesperson_name: str
    items: list[BillLineItemOut]
    subtotal: float
    bill_discount_pct: float
    grand_total: float
    created_at: str
    is_voided: bool
