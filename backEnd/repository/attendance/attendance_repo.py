from sqlalchemy import update
from models.index import attendanceTable, ipAddress
from datetime import datetime, date
from sqlalchemy.orm import Session

class AttendanceRepo:
    def __init__(self, db: Session):
        self.db = db

    # ----- Check if already checked in today (boolean) -----
    def is_checked_in(self, emp_id: int) -> bool:
        today = date.today()
        record = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= today
        ).first()
        return record is not None

    # ----- Get today’s active check-in (RowProxy or None) -----
    def get_active_checkin(self, emp_id: int):
        today = date.today()
        return self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= today,
            attendanceTable.c.check_out_time == None
        ).first()

    # ----- Check-in -----
    def checkin(self, emp_id: int, ip_address: str) -> dict:
        today = date.today()
        active_checkin = self.get_active_checkin(emp_id)
        if active_checkin:
            return {"success": False, "message": "Employee already checked in and not checked out"}
        last_checkin = self.db.query(attendanceTable).filter(
            attendanceTable.c.emp_id == emp_id,
            attendanceTable.c.check_in_time >= today
        ).order_by(attendanceTable.c.check_in_time.desc()).first()

        if last_checkin and last_checkin.check_out_time is not None:
            update_stmt = (
                update(attendanceTable)
                .where(attendanceTable.c.attendance_id == last_checkin.attendance_id)
                .values(
                    check_in_time = datetime.now(),
                    check_out_time = None,
                    isPresent = 1,
                    ip_address = ip_address
                )
            )
            self.db.execute(update_stmt)
            self.db.commit()
            return {"success": True, "message": "Checked in successfully (after checkout)"}
        insert_stmt = attendanceTable.insert().values(
            emp_id = emp_id,
            check_in_time = datetime.now(),
            ip_address = ip_address,
            isPresent = 1
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
                (attendanceTable.c.check_out_time == None)
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
