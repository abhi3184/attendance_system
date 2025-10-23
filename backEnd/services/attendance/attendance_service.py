import calendar
from datetime import date, datetime, timedelta, time

from requests import Session

from repository.index import IPRepo,AttendanceRepo,EmployeeRegistrationRepository,HolidaysRepo

class AttendanceService:
    SHIFT_START = time(10, 0)
    SHIFT_END = time(19, 0)

    def __init__(self, attendance_repo : AttendanceRepo, 
                 ip_repo : IPRepo ,
                 employeeRepo : EmployeeRegistrationRepository,
                 holidayRepo : HolidaysRepo):
        self.attendance_repo = attendance_repo
        self.ip_repo = ip_repo
        self.employeeRepo = employeeRepo,
        self.holidayRepo = holidayRepo


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
    def get_attendance_by_period(db: Session, manager_id: int, period: str):

        today = date.today()

        # Calculate start and end dates
        if period.lower() == "weekly":
            start_date = today - timedelta(days=today.weekday())  # Monday
            end_date = start_date + timedelta(days=6)            # Sunday
        elif period.lower() == "monthly":
            start_date = today.replace(day=1)
            last_day = calendar.monthrange(today.year, today.month)[1]
            end_date = today.replace(day=last_day)
        else:
            raise ValueError("Invalid period. Use 'weekly' or 'monthly'.")

        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date, datetime.max.time())

        # Fetch data from repo layer
        attendance_list = AttendanceRepo.get_attendance_by_manager_and_date_range(db, manager_id, start_datetime, end_datetime)
        holidays = AttendanceRepo.get_holidays_in_date_range(db, start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
        holidays_dict = {h.date: h.description for h in holidays}

        # Merge attendance with holidays
        result = []
        for att in attendance_list:
            att_date_str = att.check_in_time.date().strftime("%Y-%m-%d")
            result.append({
                "attendance_id": att.attendance_id,
                "emp_id": att.emp_id,
                "check_in_time": att.check_in_time,
                "check_out_time": att.check_out_time,
                "isPresent": att.isPresent,
                "holiday": holidays_dict.get(att_date_str)
            })

        return {
            "start_date": start_date,
            "end_date": end_date,
            "attendance": result,
            "holidays": holidays
        }


    @staticmethod
    def get_attendance(db: Session):
        today = date.today()
        date_str = today.strftime("%Y-%m-%d")

        # Fetch all employees and attendance
        employees = EmployeeRegistrationRepository.get_all_employees(db)
        attendance_list = AttendanceRepo.get_attendance_in_range(db, today)

        # Map emp_id -> attendance
        attendance_map = {att.emp_id: att for att in attendance_list}

        report = []
        for emp in employees:
            att = attendance_map.get(emp.emp_id)

            if att:
                check_in = att.check_in_time
                check_out = att.check_out_time
                worked_hr = att.total_hr

                # Updated status logic
                if not check_in and not check_out:
                    status = "Absent"
                else:
                    status = "Present"
            else:
                check_in = check_out = worked_hr = None
                status = "Absent"

            report.append({
                "name": f"{emp.firstName} {emp.lastName}",
                "shift": emp.shift_time,
                "date": date_str,
                "check_in": check_in,
                "check_out": check_out,
                "worked_hr": worked_hr,
                "status": status
            })

        return {"date": today, "report": report}
