from pydantic import BaseModel, EmailStr, Field


class OwnerSignupPayload(BaseModel):
    """Public signup: creates a new Store plus its first admin user."""
    store_name: str = Field(min_length=2, max_length=200)
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class StaffCreatePayload(BaseModel):
    """Admin-only: create a sales-staff account under the admin's own store."""
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class Updatestaff(BaseModel):
    """Admin-only: update a sales-staff account under the admin's own store."""
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr

class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    store_id: str
    is_active: bool


class ForgotPasswordPayload(BaseModel):
    email: EmailStr


class ResetPasswordPayload(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)