from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from schemas.holidays.holidays import AddHolidayReq,UpdateHolidayReq
from config.db import get_db
from services.index import HolidayService

holidays = APIRouter()

@holidays.post("/add_holiday")
async def add_holiday(req:AddHolidayReq , db:Session = Depends(get_db)):
    return HolidayService.add_holidays(db,req)

@holidays.get("/get_upcoming_holidays")
async def get_upcoming_holidays(db: Session = Depends(get_db)):
    return HolidayService.get_upcoming_holidays(db)

@holidays.get("/get_holidays")
async def get_holidays(db: Session = Depends(get_db)):
    return HolidayService.get_all_holidays(db)

@holidays.put("/update/{holiday_id}")
def update_holiday(holiday_id: int, req: UpdateHolidayReq, db: Session = Depends(get_db)):
    return HolidayService.update_holiday(db, holiday_id, req.dict())

@holidays.delete("/delete_holiday/{holiday_id}")
async def delete_holiday(holiday_id: int,db : Session = Depends(get_db)):
    return HolidayService.delete_holiday(db,holiday_id)