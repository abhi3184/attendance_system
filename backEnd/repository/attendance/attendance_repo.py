from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, date, timedelta
from models.index import Attendance, Employee, Holidays
import socket

class AttendanceRepo:
    def __init__(self, db: Session):
        self.db = db

    # ----- Local IP -----
    @staticmethod
    def get_local_ip():
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return None

    def get_india_time():
        from datetime import datetime, timedelta
        return datetime.utcnow() + timedelta(hours=5, minutes=30)

    def get_active_checkin(self, emp_id: int):
        today = date.today()
        return self.db.query(Attendance).filter(
            Attendance.emp_id == emp_id,
            func.date(Attendance.check_in_time) == today,
            Attendance.check_out_time.is_(None)
        ).first()
    

    def get_today_attendance(self, emp_id: int):
        today = date.today()
        return self.db.query(Attendance).filter(
            Attendance.emp_id == emp_id,
            func.date(Attendance.check_in_time) == today
        ).first()

    def checkin(self, emp_id: int, manager_id: int, ip_address: str):
        today_check = self.get_today_attendance(emp_id)

        if today_check:
            if today_check.check_out_time:
                today_check.check_out_time = None
                today_check.isPresent = 1
                self.db.commit()
                self.db.refresh(today_check)
                return {
                    "success": True,
                    "message": "Checked in again today. Existing record updated.",
                    "attendance_id": today_check.attendance_id
                }
            else:
                return {
                    "success": True,
                    "message": "Already checked in today.",
                    "attendance_id": today_check.attendance_id
                }

        attendance = Attendance(
            emp_id=emp_id,
            manager_id=manager_id,
            ip_address=ip_address,
            check_in_time=AttendanceRepo.get_india_time(),
            isPresent=1
        )
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return {
            "success": True,
            "message": "Checked in successfully.",
            "attendance_id": attendance.attendance_id
        }


    # ----- Check-out -----
    def checkout(self, emp_id: int):
        active = self.get_active_checkin(emp_id)
        if not active:
            return {"success": False, "message": "No active check-in."}

        check_out_time = AttendanceRepo.get_india_time()
        total_hours = round((check_out_time - active.check_in_time).total_seconds() / 3600, 2)

        active.check_out_time = check_out_time
        active.total_hr = total_hours
        active.isPresent = False
        self.db.commit()
        self.db.refresh(active)
        return {"success": True, "message": "Checked out successfully", "total_hours": total_hours}

    # ----- All attendance -----
    def get_all_attendance(self, start_date: date, end_date: date):
        return self.db.query(Attendance).filter(
            Attendance.check_in_time >= datetime.combine(start_date, datetime.min.time()),
            Attendance.check_in_time <= datetime.combine(end_date, datetime.max.time())
        ).all()

    # ----- Weekly attendance by manager -----
    def get_weekly_attendance(self, manager_id: int):
        today = date.today()
        start_week = today - timedelta(days=today.weekday())
        query = self.db.query(
            func.date(Attendance.check_in_time).label("day"),
            func.count(case((Attendance.is_present == True, 1))).label("present"),
            func.count(case((Attendance.is_present == False, 1))).label("absent")
        ).join(Employee).filter(
            Employee.manager_id == manager_id,
            func.date(Attendance.check_in_time).between(start_week, today)
        ).group_by(func.date(Attendance.check_in_time)).all()
        return {a.day.strftime("%Y-%m-%d"): {"present": a.present, "absent": a.absent} for a in query}

    # ----- Holidays in range -----
    def get_holidays_in_range(self, start_date: date, end_date: date):
        holidays = self.db.query(Holidays).filter(Holidays.date.between(start_date, end_date)).all()
        return {h.date: h.description for h in holidays}
    
    # Get attendance for employee within date range
    def get_attendance_by_employee(self, emp_id: int, start_date: date, end_date: date):
        return self.db.query(Attendance).filter(
            Attendance.emp_id == emp_id,
            Attendance.check_in_time >= datetime.combine(start_date, datetime.min.time()),
            Attendance.check_in_time <= datetime.combine(end_date, datetime.max.time())
        ).all()

    # Get holidays within date range
    def get_holidays_in_range(self, start_date: date, end_date: date):
        return self.db.query(Holidays).filter(
            Holidays.date >= start_date.strftime("%Y-%m-%d"),
            Holidays.date <= end_date.strftime("%Y-%m-%d")
        ).all()
