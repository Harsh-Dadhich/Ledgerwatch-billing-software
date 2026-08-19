from pydantic import BaseModel, Field


class BillLineItemRequest(BaseModel):
    product_id: str
    quantity: int = Field(ge=1)
    # Discount is optional and off by default -- applied only when the
    # salesperson explicitly chooses to, never inherited from the product.
    discount_pct: float = Field(default=0, ge=0, le=100)


class BillCreateRequest(BaseModel):
    items: list[BillLineItemRequest] = Field(min_length=1)


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
    grand_total: float
    created_at: str
