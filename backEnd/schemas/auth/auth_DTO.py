
from pydantic import BaseModel, EmailStr

class Login(BaseModel):
    login:str
    password: str