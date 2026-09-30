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