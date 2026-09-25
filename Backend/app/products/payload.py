from typing import Optional

from pydantic import BaseModel, Field


class ProductCreatePayload(BaseModel):
    # name: str = Field(min_length=1, max_length=200)
    # price: float = Field(gt=0)
    # quantity: float | None = Field(default=None, ge=0)
    name: str = Field(min_length=1, max_length=200)

    sku: str | None = Field(default=None, max_length=100)

    barcode: str | None = Field(default=None, max_length=100)

    category: str | None = Field(default=None, max_length=100)

    brand: str | None = Field(default=None, max_length=100)

    purchase_price: float | None = Field(
        default=None,
        ge=0
    )

    price: float = Field(gt=0)

    mrp: float | None = Field(
        default=None,
        ge=0
    )

    gst_pct: float | None = Field(
        default=0,
        ge=0,
        le=100
    )

    quantity: float | None = Field(
        default=None,
        ge=0
    )

    min_stock: float | None = Field(
        default=5,
        ge=0
    )


class ProductUpdatePayload(BaseModel):
    # name: str | None = Field(default=None, min_length=1, max_length=200)
    # price: float | None = Field(default=None, gt=0)
    # quantity: float | None = Field(default=None, ge=0)
    # is_active: bool | None = None
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200
    )

    sku: str | None = None

    barcode: str | None = None

    category: str | None = None

    brand: str | None = None

    purchase_price: float | None = Field(
        default=None,
        ge=0
    )

    price: float | None = Field(
        default=None,
        gt=0
    )

    mrp: float | None = Field(
        default=None,
        ge=0
    )

    gst_pct: float | None = Field(
        default=None,
        ge=0,
        le=100
    )

    quantity: float | None = Field(
        default=None,
        ge=0
    )

    min_stock: float | None = Field(
        default=None,
        ge=0
    )

    is_active: bool | None = None


class ProductOut(BaseModel):
    # id: str
    # name: str
    # price: float
    # quantity: float
    # is_active: bool
    id: str

    name: str

    sku: str | None

    barcode: str | None

    category: str | None

    brand: str | None

    purchase_price: float | None

    price: float

    mrp: float | None

    gst_pct: float | None

    quantity: float

    min_stock: float | None

    is_active: bool

class LowStockProductResponse(BaseModel):
    id: str
    name: str
    sku: Optional[str] = None
    quantity: float
    min_stock: float
