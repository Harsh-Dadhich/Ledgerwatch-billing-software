from typing import Optional

from pydantic import BaseModel


class CreateCategoryRequest(BaseModel):
    name: str
    description: Optional[str] = None


class UpdateCategoryRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    is_active: bool

class CategoryAnalyticsRow(BaseModel):
    id: Optional[str] = None  # None for a name that has no master record
    name: str
    products: int  # active products in the category
    stock: float  # total quantity on hand (untracked products count as 0)
    low_stock: int  # tracked products at or below their min_stock
    units: float  # units sold in the window
    revenue: float  # sum of line_total in the window