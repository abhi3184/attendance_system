from pydantic import BaseModel


class MobileOTPRequest(BaseModel):
    mobile: str