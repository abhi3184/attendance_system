# schemas/user.py
from pydantic import BaseModel, ConfigDict, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    mobile: str 

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    model_config = ConfigDict(extra="allow")

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    password: str
    mobile: str

    class Config:
        from_attributes = True  # instead of orm_mode=True

class UserInDB(BaseModel):
    email: EmailStr 

