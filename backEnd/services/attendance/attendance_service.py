from datetime import datetime, timedelta, time

from repository.index import IPRepo,AttendanceRepo

class AttendanceService:
    SHIFT_START = time(10, 0)
    SHIFT_END = time(19, 0)

    def __init__(self, attendance_repo : AttendanceRepo, ip_repo : IPRepo):
        self.attendance_repo = attendance_repo
        self.ip_repo = ip_repo

    # ----- Check-in -----
    def check_in(self, emp_id, manager_id, ip_address):
        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False,"data":ip_address, "message": "You are not allowed from this location"}
        return self.attendance_repo.checkin(emp_id, manager_id, ip_address)

    # ----- Check-out -----
    def check_out(self, emp_id, ip_address):
        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False, "message": "You are not allowed from this location"}
        return self.attendance_repo.checkout(emp_id)

    # ----- Status -----
    def status(self, emp_id):
        active = self.attendance_repo.get_active_checkin(emp_id)
        return {
            "success": True,
            "checked_in": bool(active),
            "check_in_time": active.check_in_time if active else None
        }

    # ----- Process attendance for UI -----
    @staticmethod
    def process_attendance(records):
        attendance_list = []
        today = datetime.now().date()
        for r in records:
            check_in_time = r.check_in_time
            check_out_time = r.check_out_time
            if check_in_time and check_out_time:
                worked_hours = round((check_out_time - check_in_time).total_seconds() / 3600, 2)
                overtime = round(max(worked_hours - 9, 0), 2)
            else:
                worked_hours = 0
                overtime = 0
            status = "Absent"
            if check_in_time and not check_out_time:
                status = "Present"
            elif check_in_time and check_out_time:
                status = "Checked-Out"
            attendance_list.append({
                "attendance_id": r.attendance_id,
                "emp_id": r.emp_id,
                "check_in_time": check_in_time,
                "check_out_time": check_out_time,
                "worked_hours": worked_hours,
                "overtime": overtime,
                "status": status
            })
        return attendance_list

    # ----- Get all attendance (with filter) -----
    def get_all_attendance(self, filter_type="today"):
        today = datetime.now().date()
        if filter_type == "today":
            start_date = end_date = today
        elif filter_type == "yesterday":
            start_date = end_date = today - timedelta(days=1)
        elif filter_type == "15days":
            start_date = today - timedelta(days=15)
            end_date = today
        elif filter_type == "1month":
            start_date = today - timedelta(days=30)
            end_date = today
        else:
            start_date = end_date = today

        records = self.attendance_repo.get_all_attendance(start_date, end_date)
        return {"success": True, "data": self.process_attendance(records), "message": "Attendance fetched successfully"}

    # ----- Get employee attendance -----
    def get_emp_attendance(self, emp_id, view_type="weekly"):
        today = datetime.now().date()
        if view_type.lower() == "weekly":
            start_date = today - timedelta(days=today.weekday())
        elif view_type.lower() == "monthly":
            start_date = today.replace(day=1)
        else:
            start_date = today

        end_date = today
        records = self.attendance_repo.get_attendance_by_employee(emp_id, start_date, end_date)
        return self.process_attendance(records)
