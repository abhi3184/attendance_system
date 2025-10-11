
from pydantic import BaseModel, EmailStr

class Login(BaseModel):
    login:str
    password: str

class EmployeeResponse(BaseModel):
    emp_id: int
    emp_code: str
    firstName: str
    lastName: str
    emailId: str
    mobile: str
    department: str
    shift_time: str
    status: str


class UpdatePasswordReq(BaseModel):
    email: str
    password: str


class RefreTokenRequest(BaseModel):
    refresh_token: str  