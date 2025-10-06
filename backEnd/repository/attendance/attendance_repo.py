from sqlalchemy import update
from models.index import attendanceTable
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
        # Start and end of today
        today = date.today()
        start_datetime = datetime.combine(today, time.min)
        end_datetime = datetime.combine(today, time.max)

        # Get today's check-in record
        today_record = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= start_datetime,
            attendanceTable.c.check_in_time <= end_datetime
        ).order_by(attendanceTable.c.check_in_time.desc()).first()

        # Case 1: No check-in today → insert new record
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

        # Case 2: Check-in exists and check-out is None → already checked in
        if today_record.check_out_time is None:
            return {"success": True, "message": "Already checked in, not checked out yet"}

        # Case 3: Check-in exists and check-out exists → just mark isPresent = 1
        update_stmt = (
            update(attendanceTable)
            .where(attendanceTable.c.attendance_id == today_record.attendance_id)
            .values( 
                isPresent=1,
                check_out_time=None,   # clear check-out for new session
                manager_id=manager_id,  # optional: update manager
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

        # Calculate total hours
        check_in_time = last_checkin.check_in_time
        check_out_time = datetime.now()
        total_seconds = (check_out_time - check_in_time).total_seconds()
        total_hours = round(total_seconds / 3600, 2)  # 2 decimal places

        # Update record
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
            # Create a temporary socket to get local IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            # doesn't have to be reachable
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except Exception:
            return None
    