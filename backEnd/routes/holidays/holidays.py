from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from schemas.holidays.holidays import AddHolidayReq
from config.db import get_db
from services.index import HolidayService

holidays = APIRouter()

@holidays.post("/add_holiday")
async def add_holiday(req:AddHolidayReq , db:Session = Depends(get_db)):
    return HolidayService.add_holidays(db,req)

@holidays.get("/get_upcoming_holidays")
async def get_upcoming_holidays(db: Session = Depends(get_db)):
    return HolidayService.get_upcoming_holidays(db)