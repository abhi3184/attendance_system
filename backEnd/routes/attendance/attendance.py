from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from repository.index import AttendanceRepo, IPRepo, EmployeeRegistrationRepository, HolidaysRepo
from services.index import AttendanceService

attendance = APIRouter()

# 🔹 Initialize repository instances and service
def get_service(db: Session):
    attendance_repo = AttendanceRepo(db)
    ip_repo = IPRepo(db)
    employee_repo = EmployeeRegistrationRepository()
    holiday_repo = HolidaysRepo()
    service = AttendanceService(db,attendance_repo, ip_repo, employee_repo, holiday_repo)
    return service

# ----- Check-in -----
@attendance.post("/checkin")
def check_in(emp_id: int, manager_id: int, db: Session = Depends(get_db)):
    service = get_service(db)
    ip_address = AttendanceRepo.get_local_ip()
    return service.check_in(emp_id, manager_id, ip_address)

# ----- Check-out -----
@attendance.post("/checkout")
def check_out(emp_id: int, db: Session = Depends(get_db)):
    service = get_service(db)
    ip_address = AttendanceRepo.get_local_ip()
    return service.check_out(emp_id, ip_address)

# ----- Status -----
@attendance.get("/status/{emp_id}")
def status(emp_id: int, db: Session = Depends(get_db)):
    service = get_service(db)
    return service.status(emp_id)

# ----- Get all attendance -----
@attendance.get("/getAllAttendance")
def get_all_attendance(db: Session = Depends(get_db)):
    service = get_service(db)
    data = service.get_attendance(db)
    return {"success": True, "data": data}

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

# ----- Weekly attendance by manager -----
@attendance.get("/weekly_attendance_by_manager/{manager_id}/{date_filter}")
def weekly_attendance_by_manager(manager_id: int, date_filter: str, db: Session = Depends(get_db)):
    service = get_service(db)
    return service.get_weekly_attendance_for_manager(db, manager_id, date_filter)

# ----- Attendance for manager by period -----
@attendance.get("/attendance_for_manager")
def attendance_period(manager_id: int, period: str, db: Session = Depends(get_db)):
    service = get_service(db)
    try:
        data = service.get_attendance_by_period(db, manager_id, period)
        return {"success": True, "data": data}
    except ValueError as e:
        return {"success": False, "message": str(e)}
