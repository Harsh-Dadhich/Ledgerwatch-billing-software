from pydantic import BaseModel, EmailStr, Field


class OwnerSignupRequest(BaseModel):
    """Public signup: creates a new Store plus its first admin user."""
    store_name: str = Field(min_length=2, max_length=200)
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class StaffCreateRequest(BaseModel):
    """Admin-only: create a sales-staff account under the admin's own store."""
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    store_id: str
