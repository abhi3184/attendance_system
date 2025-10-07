from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.index import CheckIn
from repository.index import AttendanceRepo, IPRepo
from services.index import AttendanceService

attendance = APIRouter()

def get_service(db: Session):
    attendance_repo = AttendanceRepo(db)
    ip_repo = IPRepo(db)
    service = AttendanceService(attendance_repo, ip_repo)
    return service

# ----- Check-in endpoint -----
@attendance.post("/checkin")
def check_in(emp_id: int,manager_id: int, db: Session = Depends(get_db)):
    ip_address = AttendanceRepo.get_local_ip()
    print("ip_address", ip_address)
    if not ip_address:
        return {"success": False, "message": "IP not found"}
    service = get_service(db)
    return service.check_in(emp_id,manager_id,ip_address)

# ----- Check-out endpoint -----
@attendance.post("/checkout")
def check_out(emp_id: int, db: Session = Depends(get_db)):
    ip_address = AttendanceRepo.get_local_ip()
    if not ip_address:
        return {"success": False, "message": "IP not found"}
    service = get_service(db)
    return service.check_out(emp_id, ip_address)

# ----- Status endpoint -----
@attendance.get("/status/{emp_id}")
def status(emp_id: int, db: Session = Depends(get_db)):
    service = get_service(db)
    return service.status(emp_id)


@attendance.get("/getAllAttendance")
def get_all_attendance(
    db: Session = Depends(get_db),
    filter: str = Query("today")
):
    today = datetime.now().date()

    if filter == "today":
        start_date = today
        end_date = today
    elif filter == "yesterday":
        start_date = today - timedelta(days=1)
        end_date = start_date
    elif filter == "15days":
        start_date = today - timedelta(days=15)
        end_date = today
    elif filter == "1month":
        start_date = today - timedelta(days=30)
        end_date = today
    else:
        start_date = today
        end_date = today

    records = AttendanceRepo.get_attendance(db, str(start_date), str(end_date))
    attendance_list = AttendanceService.process_attendance(records)

    return {"success": True, "data": attendance_list, "message": "Attendance fetched successfully"}

@attendance.get("/getAttendanceByEmp/{emp_id}")
def get_emp_attendance(emp_id: int, view_type: str = "weekly", db: Session = Depends(get_db)):
    try:
        data = AttendanceService.get_emp_attendance(db, emp_id, view_type)
        return {"success": True, "data": data, "message": "Employee attendance fetched successfully"}
    except ValueError as e:
        return {"success": False, "message": str(e)}