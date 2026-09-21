from typing import Optional

from pydantic import BaseModel


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