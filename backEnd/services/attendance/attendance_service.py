from datetime import date, datetime, timedelta, time

from requests import Session

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
    def get_emp_attendance(self, emp_id: str, view_type="weekly"):
        from datetime import datetime
        today = datetime.now().date()
        yesterday = today - timedelta(days=1)  # कालपर्यंत data पाहिजे

        # Determine start and end date
        if view_type.lower() == "weekly":
            start_date = today - timedelta(days=today.weekday())  # Monday
            end_date = yesterday  # कालपर्यंत
        elif view_type.lower() == "monthly":
            start_date = today.replace(day=1)
            end_date = yesterday  # कालपर्यंत
        else:
            start_date = yesterday
            end_date = yesterday

        # Fetch records
        attendance_records = self.attendance_repo.get_attendance_by_employee(emp_id, start_date, end_date)
        holidays = self.attendance_repo.get_holidays_in_range(start_date, end_date)
        holiday_dates = {h.date for h in holidays}

        # Prepare day-wise response
        response = []
        current_day = start_date
        while current_day <= end_date:
            day_str = current_day.strftime("%Y-%m-%d")
            is_holiday = day_str in holiday_dates
            att = next((r for r in attendance_records if r.check_in_time.date() == current_day), None)
            response.append({
                "date": day_str,
                "day": current_day.strftime("%A"),
                "status": "Holiday" if is_holiday else ("Present" if att else "Absent"),
                "check_in": att.check_in_time if att else None,
                "check_out": att.check_out_time if att else None,
                "total_hr": att.total_hr if att else 0
            })
            current_day += timedelta(days=1)

        return response


    def get_weekly_attendance_for_manager(db: Session, manager_id: int,date_filter :str):
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday())  # Monday

        start_str = start_of_week.strftime("%Y-%m-%d")
        end_str = today.strftime("%Y-%m-%d")

        # --- 1️⃣ Attendance ---
        attendance_query = AttendanceRepo.get_weekly_attendance_by_manager(db, manager_id, date_filter)
        attendance_map = {a.day.strftime("%Y-%m-%d"): {"present": a.present, "absent": a.absent} for a in attendance_query}

        # --- 2️⃣ Holidays ---
        holidays = AttendanceRepo.get_weekly_holidays_for_manager(db, date_filter)
        holidays_map = {h.strftime("%Y-%m-%d"): desc for h, desc in holidays.items()}

        # --- 3️⃣ Build weekly response ---
        week_dates = [start_of_week + timedelta(days=i) for i in range((today - start_of_week).days + 1)]
        result = []
        for d in week_dates:
            day_str = d.strftime("%Y-%m-%d")
            result.append({
                "name": d.strftime("%a"),
                "present": attendance_map.get(day_str, {}).get("present", 0),
                "absent": attendance_map.get(day_str, {}).get("absent", 0),
                "holiday": holidays_map.get(day_str)
            })

        return {"success": True, "data": result, "message": "Weekly attendance fetched"}
    


    @staticmethod
    def get_attendance_for_manager(db: Session, manager_id: int, date_filter: str):
        records = AttendanceRepo.get_attendance_by_manager(db, manager_id, date_filter)
        if not records:
            return {"success": False, "data": [], "message": "No attendance found"}

        holidays_dict = AttendanceRepo.get_holidays(db)
        result = []

        for r in records:
            # Convert datetime safely
            check_in_time = r.check_in_time if isinstance(r.check_in_time, datetime) else datetime.fromisoformat(str(r.check_in_time))
            check_out_time = r.check_out_time if isinstance(r.check_out_time, datetime) else datetime.fromisoformat(str(r.check_out_time)) if r.check_out_time else None

            date_obj = check_in_time.date()

            # Late calculation
            late = None
            if check_in_time.time() > AttendanceService.SHIFT_START:
                delta = datetime.combine(datetime.min, check_in_time.time()) - datetime.combine(datetime.min, AttendanceService.SHIFT_START)
                late_hours = delta.seconds // 3600
                late_minutes = (delta.seconds % 3600) // 60
                late = f"{late_hours}h {late_minutes}m"

            # Early leaving
            early = None
            if check_out_time and check_out_time.time() < AttendanceService.SHIFT_END:
                delta = datetime.combine(datetime.min, AttendanceService.SHIFT_END) - datetime.combine(datetime.min, check_out_time.time())
                early_hours = delta.seconds // 3600
                early_minutes = (delta.seconds % 3600) // 60
                early = f"{early_hours}h {early_minutes}m"

            # Holiday check
            is_holiday = date_obj in holidays_dict
            holiday_description = holidays_dict.get(date_obj, "")

            # Format times in 12-hour with minutes
            check_in_str = check_in_time.strftime("%I:%M %p") if check_in_time else None
            check_out_str = check_out_time.strftime("%I:%M %p") if check_out_time else None

            result.append({
                "attendance_id": r.attendance_id,
                "emp_id": r.emp_id,
                "emp_name": f"{r.firstName} {r.lastName}",
                "check_in_time": check_in_str,
                "check_out_time": check_out_str,
                "total_hr": r.total_hr,
                "isPresent": r.isPresent,
                "late": late,
                "early": early,
                "is_holiday": is_holiday,
                "holiday_description": holiday_description
            })

        return {"success": True, "data": result, "message": "Data fetched successfully"}



