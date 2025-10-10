from sqlalchemy import case, func, outerjoin, select, update
from models.index import attendanceTable,employeeTable,holidaysTable
from sqlalchemy.orm import Session
from datetime import datetime, date, time, timedelta
from schemas.index import CheckIn
import socket
class AttendanceRepo:
    def __init__(self, db: Session):
        self.db = db

    # ----- Check if employee already checked in today -----
    def is_checked_in(self, emp_id: int) -> bool:
        today = date.today()
        record = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= today
        ).first()
        return record is not None

    # ----- Get today's active check-in (not checked out yet) -----
    def get_active_checkin(self, emp_id: int):
        today = date.today()
        return self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= today,
            attendanceTable.c.check_out_time.is_(None)
        ).first()

    # ----- Check-in -----
    def checkin(self, emp_id: int, manager_id: int, ip_address: str) -> dict:
    
        today = date.today()
        start_datetime = datetime.combine(today, time.min)
        end_datetime = datetime.combine(today, time.max)

  
        today_record = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= start_datetime,
            attendanceTable.c.check_in_time <= end_datetime
        ).order_by(attendanceTable.c.check_in_time.desc()).first()

    
        if not today_record:
            insert_stmt = attendanceTable.insert().values(
                emp_id=emp_id,
                check_in_time=datetime.now(),
                check_out_time=None,
                isPresent=1,
                manager_id=manager_id,
                ip_address=ip_address
            )
            self.db.execute(insert_stmt)
            self.db.commit()
            return {"success": True, "message": "Checked in successfully"}

       
        if today_record.check_out_time is None:
            return {"success": True, "message": "Already checked in, not checked out yet"}


        update_stmt = (
            update(attendanceTable)
            .where(attendanceTable.c.attendance_id == today_record.attendance_id)
            .values( 
                isPresent=1,
                check_out_time=None, 
                manager_id=manager_id, 
                ip_address=ip_address
            )
        )
        self.db.execute(update_stmt)
        self.db.commit()
        return {"success": True, "message": "Check in successfull"}


    # ----- Check-out -----
    def checkout(self, emp_id: int) -> dict:
        # Start and end of today
        today = date.today()
        start_datetime = datetime.combine(today, time.min)
        end_datetime = datetime.combine(today, time.max)

        # Get the latest active check-in for today
        last_checkin = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= start_datetime,
            attendanceTable.c.check_in_time <= end_datetime,
            attendanceTable.c.check_out_time.is_(None)
        ).order_by(attendanceTable.c.check_in_time.desc()).first()

        if not last_checkin:
            return {"success": False, "message": "No active check-in found"}

        check_in_time = last_checkin.check_in_time
        check_out_time = datetime.now()
        total_seconds = (check_out_time - check_in_time).total_seconds()
        total_hours = round(total_seconds / 3600, 2)  # 2 decimal places

        update_stmt = (
            update(attendanceTable)
            .where(attendanceTable.c.attendance_id == last_checkin.attendance_id)
            .values(
                check_out_time=check_out_time,
                isPresent=0,
                total_hr=total_hours
            )
        )
        self.db.execute(update_stmt)
        self.db.commit()

        return {
            "success": True,
            "message": "Checked out successfully",
            "total_hours": total_hours
        }

    # ----- Get active check-in stats -----
    def get_stats(self, emp_id: int):
        return self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_out_time.is_(None)
        ).first()

    def get_local_ip():
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except Exception:
            return None
    

    @staticmethod
    def get_all_attendance(db: Session):
        today = datetime.now().date()

        # Left join all employees with attendance of today
        stmt = (
            select(
                employeeTable.c.emp_id,
                employeeTable.c.firstName,
                employeeTable.c.lastName,
                employeeTable.c.shift_time,
                attendanceTable.c.attendance_id,
                attendanceTable.c.check_in_time,
                attendanceTable.c.check_out_time,
                attendanceTable.c.total_hr,
                attendanceTable.c.isPresent
            )
            .select_from(
                outerjoin(
                    employeeTable,
                    attendanceTable,
                    (employeeTable.c.emp_id == attendanceTable.c.emp_id) &
                    (attendanceTable.c.check_in_time.like(f"{today}%"))
                )
            )
            .order_by(employeeTable.c.emp_id)
        )

        result = db.execute(stmt).fetchall()
        attendance_list = []

        for row in result:
            check_in_time = row.check_in_time
            check_out_time = row.check_out_time

            # Shift office start
            if row.shift_time and row.shift_time.lower() == "morning":
                office_start = time(10, 0, 0)
            elif row.shift_time and row.shift_time.lower() == "afternoon":
                office_start = time(12, 0, 0)
            else:
                office_start = time(10, 0, 0)

            # Determine status
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
            else:  # check_in and check_out present
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
    def get_attendance(db: Session, start_date: str, end_date: str):
        stmt = (
            select(
                employeeTable.c.emp_id,
                employeeTable.c.firstName,
                employeeTable.c.lastName,
                employeeTable.c.shift_time,
                attendanceTable.c.attendance_id,
                attendanceTable.c.check_in_time,
                attendanceTable.c.check_out_time,
                attendanceTable.c.total_hr,
                attendanceTable.c.isPresent
            )
            .select_from(
                outerjoin(
                    employeeTable,
                    attendanceTable,
                    (employeeTable.c.emp_id == attendanceTable.c.emp_id) &
                    (attendanceTable.c.check_in_time >= start_date) &
                    (attendanceTable.c.check_in_time <= end_date + " 23:59:59")
                )
            )
            .order_by(employeeTable.c.emp_id)
        )
        return db.execute(stmt).fetchall()
    
    @staticmethod
    def get_holidays_in_range(db: Session, start_date: date, end_date: date):
    # Return dict {date: description}
        rows = db.execute(
            select(holidaysTable.c.date, holidaysTable.c.description)
            .where(holidaysTable.c.date.between(start_date, end_date))
        ).fetchall()

        holiday_dict = {}
        for row in rows:
            # Make sure row.date is a date object
            holiday_date = row.date if isinstance(row.date, date) else datetime.fromisoformat(row.date).date()
            holiday_dict[holiday_date] = row.description

        return holiday_dict

    @staticmethod
    def get_attendance_by_employee(db: Session, emp_id: int, start_date: date, end_date: date):
        # Include the full end_date day by adding 1 day in the filter
        rows = db.execute(
            select(attendanceTable)
            .where(attendanceTable.c.emp_id == emp_id)
            .where(attendanceTable.c.check_in_time >= datetime.combine(start_date, datetime.min.time()))
            .where(attendanceTable.c.check_in_time < datetime.combine(end_date + timedelta(days=1), datetime.min.time()))
        ).fetchall()
        
        # Convert rows to dict for easier access
        attendance_list = []
        for row in rows:
            attendance_list.append({
                "attendance_id": row.attendance_id,
                "emp_id": row.emp_id,
                "total_hr": row.total_hr,
                "check_in_time": row.check_in_time,
                "check_out_time": row.check_out_time,
                "worked_hours": row.total_hr,
            })
        return attendance_list
    


    @staticmethod
    def get_weekly_attendance(db: Session, manager_id: int):
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday())  # Monday

        # 1️⃣ Get attendance counts grouped by date
        attendance_query = db.query(
            func.date(attendanceTable.c.check_in_time).label("day"),
            func.sum(case((attendanceTable.c.isPresent == 1, 1), else_=0)).label("present"),
            func.sum(case((attendanceTable.c.isPresent == 0, 1), else_=0)).label("absent")
        ).join(
            employeeTable,
            attendanceTable.c.emp_id == employeeTable.c.emp_id
        ).filter(
            employeeTable.c.manager_id == manager_id,
            func.date(attendanceTable.c.check_in_time).between(start_of_week, today)
        ).group_by(
            func.date(attendanceTable.c.check_in_time)
        ).all()

        # Map attendance by date string
        attendance_map = {a.day.strftime("%Y-%m-%d"): {"present": a.present, "absent": a.absent} for a in attendance_query}


        # 2️⃣ Get holidays within week
        holidays = db.query(
            holidaysTable.c.date,
            holidaysTable.c.description
        ).filter(
            holidaysTable.c.date.between(start_of_week, today)
        ).all()
        holidays_map = {
            datetime.strptime(h.date, "%Y-%m-%d").strftime("%Y-%m-%d"): h.description
            for h in holidays
        }

        # 3️⃣ Build final response for all weekdays
        week_dates = [start_of_week + timedelta(days=i) for i in range((today - start_of_week).days + 1)]
        result = []
        for d in week_dates:
            day_str = d.strftime("%Y-%m-%d")
            result.append({
                "name": d.strftime("%a"),  # Mon, Tue...
                "present": attendance_map.get(day_str, {}).get("present", 0),
                "absent": attendance_map.get(day_str, {}).get("absent", 0),
                "holiday": holidays_map.get(day_str, None)
            })

        return {"success": True, "data": result, "message": "Weekly attendance fetched"}
    

    @staticmethod
    def get_attendance_by_manager(db: Session, manager_id: int, date_filter: str):
        today = date.today()

        if date_filter.lower() == "today":
            start_date = today
        elif date_filter.lower() == "yesterday":
            start_date = today - timedelta(days=1)
        elif date_filter.lower() == "weekly":
            start_date = today - timedelta(days=7)
        elif date_filter.lower() == "monthly":
            start_date = today - timedelta(days=30)
        else:
            start_date = None

        query = select(
            attendanceTable.c.attendance_id,
            attendanceTable.c.emp_id,
            attendanceTable.c.check_in_time,
            attendanceTable.c.check_out_time,
            attendanceTable.c.total_hr,
            attendanceTable.c.isPresent,
            employeeTable.c.firstName,
            employeeTable.c.lastName
        ).join(
            employeeTable, attendanceTable.c.emp_id == employeeTable.c.emp_id
        ).where(
            attendanceTable.c.manager_id == manager_id
        )

        if start_date:
            query = query.where(attendanceTable.c.check_in_time >= datetime.combine(start_date, datetime.min.time()))

        return db.execute(query).fetchall()

    @staticmethod
    def get_holidays(db: Session):
        rows = db.execute(select(holidaysTable.c.date, holidaysTable.c.description)).fetchall()
        # Ensure key is date object
        return {datetime.fromisoformat(row.date).date() if isinstance(row.date, str) else row.date: row.description for row in rows}