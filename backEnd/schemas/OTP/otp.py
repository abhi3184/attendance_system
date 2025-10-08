from pydantic import BaseModel, EmailStr

class EmailOTPRequest(BaseModel):
    email: EmailStr

class EmailOTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str