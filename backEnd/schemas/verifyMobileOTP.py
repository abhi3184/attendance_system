from pydantic import BaseModel


class VerifyMobileOTPRequest(BaseModel):
    mobile: str
    otp: str