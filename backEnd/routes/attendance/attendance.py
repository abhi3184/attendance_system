from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config.db import get_db
from repository.index import AttendanceRepo
from services.index import AttendanceService

attendance = APIRouter()

def get_service(db: Session):
    attendance_repo = AttendanceRepo(db)
    ip_repo = attendance_repo  # assuming same repo handles IP, or replace with IPRepo
    return AttendanceService(attendance_repo, ip_repo)

# ----- Check-in -----
@attendance.post("/checkin")
def check_in(emp_id: int, manager_id: int, db: Session = Depends(get_db)):
    ip_address = AttendanceRepo.get_local_ip()
    service = get_service(db)
    return service.check_in(emp_id, manager_id, ip_address)

# ----- Check-out -----
@attendance.post("/checkout")
def check_out(emp_id: int, db: Session = Depends(get_db)):
    ip_address = AttendanceRepo.get_local_ip()
    service = get_service(db)
    return service.check_out(emp_id, ip_address)

# ----- Status -----
@attendance.get("/status/{emp_id}")
def status(emp_id: int, db: Session = Depends(get_db)):
    service = get_service(db)
    return service.status(emp_id)

# ----- All attendance -----
@attendance.get("/getAllAttendance")
def get_all_attendance(db: Session = Depends(get_db), filter: str = Query("today")):
    service = get_service(db)
    return service.get_all_attendance(filter)

# ----- Employee attendance -----
@attendance.get("/getAttendanceByEmp/{emp_id}")
def get_emp_attendance(emp_id: int, view_type: str = "weekly", db: Session = Depends(get_db)):
    service = get_service(db)
    return {"success": True, "data": service.get_emp_attendance(emp_id, view_type), "message": "Employee attendance fetched successfully"}
