from pydantic import BaseModel


class VerifyEmailOTPRequest(BaseModel):
    email: str
    otp: str