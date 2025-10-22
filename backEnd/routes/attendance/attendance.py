from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config.db import get_db
from repository.index import AttendanceRepo,IPRepo
from services.index import AttendanceService

attendance = APIRouter()

def get_service(db: Session):
    attendance_repo = AttendanceRepo(db)
    ip_repo = IPRepo(db)
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
def get_emp_attendance(emp_id: str, view_type: str = "weekly", db: Session = Depends(get_db)):
    service = get_service(db)
    data = service.get_emp_attendance(emp_id, view_type)
    return {
        "success": True,
        "data": data,
        "message": "Employee attendance fetched successfully"
    }

@attendance.get("/weekly_attendance_by_manager/{manager_id}/{date_filter}")
def weekly_attendance_by_manager(manager_id: int,date_filter: str, db: Session = Depends(get_db)):
    return AttendanceService.get_weekly_attendance_for_manager(db, manager_id,date_filter)

@attendance.get("/attendance_for_manager")
def get_attendance_for_manager(manager_id: int, date_filter: str, db: Session = Depends(get_db)):
    return AttendanceService.get_attendance_for_manager(db, manager_id, date_filter)

