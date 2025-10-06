from repository.index import AttendanceRepo, IPRepo
from schemas.index import CheckIn
from sqlalchemy.orm import Session

class AttendanceService:
    def __init__(self, attendance_repo: AttendanceRepo, ip_repo: IPRepo):
        self.attendance_repo = attendance_repo
        self.ip_repo = ip_repo

    # ----- Check-in with IP verification -----
    def check_in(self, emp_id:int, manager_id:int, ip_address:str) -> dict:
        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False, "message": "You are not allowed from this location"}
        return self.attendance_repo.checkin(emp_id,manager_id,ip_address)
    
    # ----- Check-out with IP verification -----
    def check_out(self, emp_id: int, ip_address: str) -> dict:
        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False, "data": ip_address, "message": "You are not allowed from this location"}
        return self.attendance_repo.checkout(emp_id)

    # ----- Get status for UI (first check-in of the day) -----
    def status(self, emp_id: int) -> dict:
        active = self.attendance_repo.get_stats(emp_id)
        return {
            "success": True,
            "checked_in": bool(active),
            "check_in_time": active.check_in_time if active else None
        }
