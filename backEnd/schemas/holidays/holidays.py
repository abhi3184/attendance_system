from pydantic import BaseModel, EmailStr
from datetime import date, datetime


class AddHolidayReq(BaseModel):
    date : date
    description : str
    type : str


class UpdateHolidayReq(BaseModel):
    date : date
    description : str
    type : str