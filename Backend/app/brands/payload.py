from typing import Optional

from pydantic import BaseModel

from app.categories.payload import CategoryAnalyticsRow


class CreateBrandRequest(BaseModel):
    name: str
    description: Optional[str] = None


class UpdateBrandRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class BrandResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    is_active: bool

class BrandAnalyticsRow(CategoryAnalyticsRow):
    """Same shape as the category row: id, name, products, stock, low_stock, units, revenue."""