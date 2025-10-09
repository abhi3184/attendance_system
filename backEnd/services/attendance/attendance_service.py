from datetime import date, datetime, time, timedelta
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
            return {"success": False,  "message": "You are not allowed from this location"}
        return self.attendance_repo.checkin(emp_id,manager_id,ip_address)
    
    # ----- Check-out with IP verification -----
    def check_out(self, emp_id: int, ip_address: str) -> dict:
        if not self.ip_repo.is_ip_allowed(ip_address):
            return {"success": False,  "message": "You are not allowed from this location"}
        return self.attendance_repo.checkout(emp_id)

    # ----- Get status for UI (first check-in of the day) -----
    def status(self, emp_id: int) -> dict:
        active = self.attendance_repo.get_stats(emp_id)
        return {
            "success": True,
            "checked_in": bool(active),
            "check_in_time": active.check_in_time if active else None
        }


    @staticmethod
    def get_all_attendance(db: Session):
        return AttendanceRepo.get_all_attendance(db)

    @staticmethod
    def get_attendance_by_emp(db: Session, emp_id: str):
        return AttendanceRepo.get_attendance_by_emp(db,emp_id)
    

    @staticmethod
    def process_attendance(records):
        today = datetime.now().date()
        attendance_list = []

        for row in records:
            check_in_time = row.check_in_time
            check_out_time = row.check_out_time

            # Shift start
            if row.shift_time and row.shift_time.lower() == "morning":
                office_start = time(10, 0, 0)
            elif row.shift_time and row.shift_time.lower() == "afternoon":
                office_start = time(12, 0, 0)
            else:
                office_start = time(10, 0, 0)

            # Determine status and times
            if not check_in_time and not check_out_time:
                status = "Absent"
                worked_hours = 0
                overtime = 0
                late_hours = 0
                late_minutes = 0
                is_late = False
            elif check_in_time and not check_out_time:
                status = "Present"
                worked_hours = 0
                overtime = 0
                if check_in_time.time() > office_start:
                    is_late = True
                    late_delta = datetime.combine(today, check_in_time.time()) - datetime.combine(today, office_start)
                    late_hours = late_delta.seconds // 3600
                    late_minutes = (late_delta.seconds % 3600) // 60
                else:
                    is_late = False
                    late_hours = 0
                    late_minutes = 0
            else:
                status = "Checked-Out"
                worked_hours = round((check_out_time - check_in_time).total_seconds() / 3600, 2)
                overtime = round(max(worked_hours - 9, 0), 2)
                if check_in_time.time() > office_start:
                    is_late = True
                    late_delta = datetime.combine(today, check_in_time.time()) - datetime.combine(today, office_start)
                    late_hours = late_delta.seconds // 3600
                    late_minutes = (late_delta.seconds % 3600) // 60
                else:
                    is_late = False
                    late_hours = 0
                    late_minutes = 0

            attendance_list.append({
                "attendance_id": row.attendance_id,
                "emp_id": row.emp_id,
                "name": f"{row.firstName} {row.lastName}",
                "shift": row.shift_time,
                "check_in_time": check_in_time,
                "check_out_time": check_out_time,
                "worked_hours": worked_hours,
                "overtime": overtime,
                "status": status,
                "late": is_late,
                "late_hours": late_hours,
                "late_minutes": late_minutes
            })

        return attendance_list
    


    @staticmethod
    def get_emp_attendance(db, emp_id: int, view_type: str = "weekly"):
        today = datetime.now().date()
        
        # Determine start date
        if view_type.lower() == "weekly":
            start_date = today - timedelta(days=today.weekday())
        elif view_type.lower() == "monthly":
            start_date = today.replace(day=1)
        else:
            raise ValueError("view_type must be 'weekly' or 'monthly'")

        end_date = today

        # Get attendance and holiday data
        attendance_rows = AttendanceRepo.get_attendance_by_employee(db, emp_id, start_date, end_date)
        holiday_dates = AttendanceRepo.get_holidays_in_range(db, start_date, end_date)
        holiday_dict = AttendanceRepo.get_holidays_in_range(db, start_date, end_date)
        print("attendance", attendance_rows)

        # Build dictionary of attendance keyed by date
        end_date = today - timedelta(days=1)
        attendance_dict = {}
        for row in attendance_rows:
            check_in = row.get("check_in_time")  # use dict key
            if check_in:
                if isinstance(check_in, str):
                    check_in = datetime.fromisoformat(check_in)  # convert string to datetime
                attendance_dict[check_in.date()] = row

        daily_list = []
        current_day = start_date

        while current_day <= end_date:
            is_weekend = current_day.weekday() >= 6
            is_holiday = current_day in holiday_dates
            holiday_description = holiday_dict.get(current_day) if is_holiday else None
            att = attendance_dict.get(current_day)


            print("holidays",current_day)
            # Determine status
            if is_holiday:
                status = "Holiday"
            elif is_weekend:
                status = "Weekend"
            elif att:
                check_in_time = att.get("check_in_time")
                check_out_time = att.get("check_out_time")
                
                if check_in_time and not check_out_time:
                    status = "Present"
                elif check_in_time and check_out_time:
                    status = "Present"
                else:
                    status = "Absent"
            else:
                status = "Absent"

            daily_list.append({
                "date": current_day,
                "status": status,
                "description": holiday_description,
                "is_weekend": is_weekend,
                "is_holiday": is_holiday,
                "toatl_hr": att.get("total_hr") if att else None,
                "check_in_time": att.get("check_in_time") if att else None,
                "check_out_time": att.get("check_out_time") if att else None
            })

            current_day += timedelta(days=1)

        return daily_list
    
    @staticmethod
    def get_weekly_attendance(db, manager_id: int):
        data = AttendanceRepo.get_weekly_attendance(db, manager_id)
        return {"success": True, "data": data, "message": "Weekly attendance fetched"}