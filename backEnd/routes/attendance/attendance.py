from fastapi import APIRouter, Depends, HTTPException,Security,status
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.index import CheckIn
from services.index import AttendanceService
from repository.index import AttendanceRepo,IPRepo
from typing import Dict

attendance = APIRouter()

@attendance.post("/checkin")
async def checkin(check_req: CheckIn, db: Session = Depends(get_db)):
    attendance_repo = AttendanceRepo(db)
    ip_repo = IPRepo(db)
    service = AttendanceService(attendance_repo, ip_repo)

    result = service.check_in(check_req.emp_id, check_req.ip_address)
    if not result["success"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return result

@attendance.post("/checkout")
async def checkout(check_req: CheckIn, db: Session = Depends(get_db)):
    repo = AttendanceRepo(db)
    result = repo.checkout(check_req.emp_id)

    if not result["success"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])

    return result
