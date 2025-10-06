from sqlalchemy import update
from models.index import attendanceTable
from sqlalchemy.orm import Session
from datetime import datetime, date
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
    def checkin(self, emp_id:int, manager_id:int,ip_address:str) -> dict:
        today = date.today()
        active_checkin = self.get_active_checkin(emp_id)
        if active_checkin:
            return {"success": False, "message": "Already checked in and not checked out"}

        # Check if any previous check-in exists today
        last_checkin = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= today
        ).order_by(attendanceTable.c.check_in_time.desc()).first()

        if last_checkin and last_checkin.check_out_time is not None:
            # Insert new check-in in same row (overwrite last check-in)
            update_stmt = (
                update(attendanceTable)
                .where(attendanceTable.c.attendance_id == last_checkin.attendance_id)
                .values(
                    check_in_time=datetime.now(),
                    check_out_time=None,
                    isPresent=1,
                    manger_id=manager_id,
                    ip_address=ip_address
                )
            )
            self.db.execute(update_stmt)
            self.db.commit()
            return {"success": True, "message": "Checked in successfully (after checkout)"}

        # Normal insert
        insert_stmt = attendanceTable.insert().values(
            emp_id=emp_id,
            check_in_time=datetime.now(),
            ip_address=ip_address,
            manger_id=manager_id,
            isPresent=1
        )
        self.db.execute(insert_stmt)
        self.db.commit()
        return {"success": True, "message": "Checked in successfully"}

    # ----- Check-out -----
    def checkout(self, emp_id: int) -> dict:
        today = date.today()
        update_stmt = (
            update(attendanceTable)
            .where(
                (attendanceTable.c.emp_id == emp_id) &
                (attendanceTable.c.check_in_time >= today) &
                (attendanceTable.c.check_out_time.is_(None))
            )
            .values(
                check_out_time=datetime.now(),
                isPresent=0
            )
        )
        result = self.db.execute(update_stmt)
        self.db.commit()

        if result.rowcount == 0:
            return {"success": False, "message": "No active check-in found"}

        return {"success": True, "message": "Checked out successfully"}

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
    