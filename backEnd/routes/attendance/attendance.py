from fastapi import APIRouter, Depends
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
