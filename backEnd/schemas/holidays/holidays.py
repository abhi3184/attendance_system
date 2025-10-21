# schemas/holidays/holidays.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

# ----- Request schema for adding holiday -----
class AddHolidayReq(BaseModel):
    holiday_date: date = Field(..., description="Holiday date in YYYY-MM-DD format")
    description: str = Field(..., description="Description of holiday")
    type: Optional[str] = Field("Public", description="Type of holiday, e.g., Public, Optional")

# ----- Request schema for updating holiday -----
class UpdateHolidayReq(BaseModel):
    holiday_date: date = Field(..., description="Holiday date in YYYY-MM-DD format")
    description: str = Field(..., description="Description of holiday")
    type: Optional[str] = Field("Public", description="Type of holiday")

# ----- Response schema for getting holiday -----
class HolidayResponse(BaseModel):
    holidays_id: int
    date: date
    description: str
    type: str

    class Config:
        orm_mode = True

# ----- Response schema for list of holidays -----
class HolidayListResponse(BaseModel):
    success: bool
    data: Optional[list[HolidayResponse]] = []
    message: str
