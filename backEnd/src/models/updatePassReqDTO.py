from pydantic import BaseModel


class UpdatePasswordRequest(BaseModel):
    email: str
    new_password: str