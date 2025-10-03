from pydantic import BaseModel

class Employee(BaseModel):
    username: str
    email: str
    password: str
    mobile: str

class Login(BaseModel):
    login:str
    password: str