from sqlalchemy import case, select, update
from models.index import attendanceTable,employeeTable
from sqlalchemy.orm import Session
from datetime import datetime, date, time
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
        today_str = datetime.now().strftime("%Y-%m-%d")
        order_case = case(
            (attendanceTable.c.check_in_time.startswith(today_str), 0),
            else_=1
        )

        stmt = (
            select(
                attendanceTable.c.attendance_id,
                attendanceTable.c.emp_id,
                employeeTable.c.firstName,
                employeeTable.c.lastName,
                employeeTable.c.shift_time,
                attendanceTable.c.check_in_time,
                attendanceTable.c.check_out_time,
                attendanceTable.c.total_hr,
                attendanceTable.c.isPresent
            )
            .select_from(attendanceTable.join(employeeTable, attendanceTable.c.emp_id == employeeTable.c.emp_id))
            .order_by(order_case, attendanceTable.c.check_in_time)
        )

        result = db.execute(stmt).fetchall()
        attendance_list = []

        for row in result:
            check_in_time = row.check_in_time  
            check_out_time = row.check_out_time  

         
            if row.shift_time == "morning":
                office_start_time = check_in_time.replace(hour=10, minute=0, second=0)
            elif row.shift_time == "afternoon":
                office_start_time = check_in_time.replace(hour=12, minute=0, second=0)
            else:
                office_start_time = check_in_time.replace(hour=10, minute=0, second=0)

     
            if check_in_time > office_start_time:
                late_timedelta = check_in_time - office_start_time
                late_hours = late_timedelta.seconds // 3600
                late_minutes = (late_timedelta.seconds % 3600) // 60
                is_late = True
            else:
                late_hours = 0
                late_minutes = 0
                is_late = False

            if check_out_time:
                worked_hours = round((check_out_time - check_in_time).total_seconds() / 3600, 2)
                overtime = round(max(worked_hours - 9, 0), 2)
            else:
                worked_hours = 0
                overtime = 0

            attendance_list.append({
                "attendance_id": row.attendance_id,
                "emp_id": row.emp_id,
                "name": f"{row.firstName} {row.lastName}",
                "shift": row.shift_time,
                "check_in_time": check_in_time,
                "check_out_time": check_out_time,
                "worked_hours": worked_hours,
                "overtime": overtime,
                "late": is_late,
                "late_hours": late_hours,
                "late_minutes": late_minutes
            })
        return attendance_list
    
    @staticmethod
    def get_attendance_by_emp(db: Session, emp_id: str):
        today_str = datetime.now().strftime("%Y-%m-%d")
        order_case = case(
            (attendanceTable.c.check_in_time.like(f"{today_str}%"), 0),
            else_=1
        )

        query = (
            select(
                attendanceTable.c.attendance_id,
                attendanceTable.c.emp_id,
                employeeTable.c.firstName,
                employeeTable.c.lastName,
                employeeTable.c.shift_time,
                attendanceTable.c.check_in_time,
                attendanceTable.c.check_out_time,
                attendanceTable.c.total_hr,
                attendanceTable.c.isPresent
            )
            .select_from(
                attendanceTable.join(
                    employeeTable,
                    attendanceTable.c.emp_id == employeeTable.c.emp_id
                )
            )
            .where(attendanceTable.c.emp_id == emp_id)
            .order_by(order_case, attendanceTable.c.check_in_time)
        )

        result = db.execute(query).fetchall()
        attendance_list = []

        for row in result:
            check_in_time = row.check_in_time
            check_out_time = row.check_out_time
            if row.shift_time == "morning":
                office_start_time = check_in_time.replace(hour=10, minute=0, second=0)
            elif row.shift_time == "afternoon":
                office_start_time = check_in_time.replace(hour=12, minute=0, second=0)
            else:
                office_start_time = check_in_time.replace(hour=10, minute=0, second=0)
            if check_in_time and check_in_time > office_start_time:
                late_timedelta = check_in_time - office_start_time
                late_hours = late_timedelta.seconds // 3600
                late_minutes = (late_timedelta.seconds % 3600) // 60
                is_late = True
            else:
                late_hours = 0
                late_minutes = 0
                is_late = False

            if check_in_time and check_out_time:
                worked_hours = round((check_out_time - check_in_time).total_seconds() / 3600, 2)
                overtime = round(max(worked_hours - 9, 0), 2)
            else:
                worked_hours = 0
                overtime = 0

            attendance_list.append({
                "attendance_id": row.attendance_id,
                "emp_id": row.emp_id,
                "name": f"{row.firstName} {row.lastName}",
                "shift": row.shift_time,
                "check_in_time": check_in_time,
                "check_out_time": check_out_time,
                "worked_hours": worked_hours,
                "overtime": overtime,
                "late": is_late,
                "late_hours": late_hours,
                "late_minutes": late_minutes,
                "isPresent": row.isPresent
            })

        return attendance_list