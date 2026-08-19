from pydantic import BaseModel, Field


class ProductCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    price: float = Field(gt=0)


class ProductUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    price: float | None = Field(default=None, gt=0)
    is_active: bool | None = None


class ProductOut(BaseModel):
    id: str
    name: str
    price: float
    is_active: bool
