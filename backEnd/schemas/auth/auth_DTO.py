# schemas/login.py
from pydantic import BaseModel, EmailStr, Field

# ----- Request -----
class Login(BaseModel):
    login: EmailStr
    password: str

class UpdatePasswordReq(BaseModel):
    email: EmailStr
    password: str

# ----- Response -----
class EmployeeResponse(BaseModel):
    emp_id: int
    emp_code: str
    firstName: str
    lastName: str
    emailId: EmailStr
    mobile: str
    department: str
    shift: str
    status: str
    role: str

class LoginResponse(BaseModel):
    success: bool
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    employee: EmployeeResponse


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Type of the token")

class RefreTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="JWT refresh token")