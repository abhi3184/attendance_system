from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from config.db import get_db
from repository.index import AttendanceRepo,IPRepo
from services.index import AttendanceService

attendance = APIRouter()

# ----- Check-in -----
@attendance.post("/checkin")
def check_in(emp_id: int, manager_id: int, db: Session = Depends(get_db)):
    ip_address = AttendanceRepo.get_local_ip()
    return AttendanceService.check_in(emp_id, manager_id, ip_address)

# ----- Check-out -----
@attendance.post("/checkout")
def check_out(emp_id: int, db: Session = Depends(get_db)):
    ip_address = AttendanceRepo.get_local_ip()
    return AttendanceService.check_out(emp_id, ip_address)

# ----- Status -----
@attendance.get("/status/{emp_id}")
def status(emp_id: int, db: Session = Depends(get_db)):

    return AttendanceService.status(emp_id)


@attendance.get("/getAllAttendance")
def getAllAttendance( db: Session = Depends(get_db)):
    data = AttendanceService.get_attendance(db)
    return {"success": True, "data": data}

# ----- Employee attendance -----
@attendance.get("/getAttendanceByEmp/{emp_id}")
def get_emp_attendance(emp_id: str, view_type: str = "weekly", db: Session = Depends(get_db)):

    data = AttendanceService.get_emp_attendance(emp_id, view_type)
    return {
        "success": True,
        "data": data,
        "message": "Employee attendance fetched successfully"
    }

@attendance.get("/weekly_attendance_by_manager/{manager_id}/{date_filter}")
def weekly_attendance_by_manager(manager_id: int,date_filter: str, db: Session = Depends(get_db)):
    return AttendanceService.get_weekly_attendance_for_manager(db, manager_id,date_filter)

@attendance.get("/attendance_for_manager")
def attendance_period(manager_id: int, period: str, db: Session = Depends(get_db)):
    try:
        data = AttendanceService.get_attendance_by_period(db, manager_id, period)
        return {"success": True, "data": data}
    except ValueError as e:
        return {"success": False, "message": str(e)}

