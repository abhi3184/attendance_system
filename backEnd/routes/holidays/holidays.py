# routes/holidays_route.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.holidays.holidays import AddHolidayReq, UpdateHolidayReq
from services.index import HolidayService
from utils.deps import get_current_user, role_checker

holidays = APIRouter()

@holidays.post("/add_holiday")
def add_holiday(req: AddHolidayReq, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return HolidayService.add_holidays(db, req)

@holidays.get("/get_upcoming_holidays")
def get_upcoming_holidays(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return HolidayService.get_upcoming_holidays(db)

@holidays.get("/get_holidays")
def get_holidays(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return HolidayService.get_all_holidays(db)

@holidays.put("/update/{holiday_id}")
def update_holiday(holiday_id: int, req: UpdateHolidayReq, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return HolidayService.update_holiday(db, holiday_id, req.dict())

@holidays.delete("/delete_holiday/{holiday_id}")
def delete_holiday(holiday_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return HolidayService.delete_holiday(db, holiday_id)
