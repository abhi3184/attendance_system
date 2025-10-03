from pydantic import BaseModel

class UpdatePasswordReq(BaseModel):
    email: str
    password: str
