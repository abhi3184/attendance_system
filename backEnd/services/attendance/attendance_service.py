
from repository.index import AttendanceRepo,IPRepo

class AttendanceService:
    def __init__(self, attendance_repo: AttendanceRepo, ip_repo: IPRepo):
        self.attendance_repo = attendance_repo
        self.ip_repo = ip_repo

    def check_in(self, emp_id: int, ip_address: str) -> dict:

        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False, "message": "You are not allowed from this location"}

        return self.attendance_repo.checkin(emp_id, ip_address)
    
    def check_out(self, emp_id: int, ip_address: str) -> dict:
        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False, "message": "You are not allowed from this location"}

        return self.attendance_repo.checkOut(emp_id, ip_address)
    

    def check_out(self, emp_id: str) -> dict:
        today_record = self.attendance_repo.is_checked_in(emp_id)
        if not today_record:
            return {"success": False, "message": "No active check-in found"}

        return self.attendance_repo.checkout(emp_id)