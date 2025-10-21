# repositories/dashboard_repo.py
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from models.employee import Employee
from models.attendance import Attendance
from models.leave import Leave

class DashboardRepo:

    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def all_employee_count(db: Session) -> int:
        return db.query(func.count(Employee.emp_id)).scalar()

    @staticmethod
    def all_managers_count(db: Session) -> int:
        return db.query(func.count(Employee.emp_id)).filter(Employee.roles_id == 2).scalar()

    @staticmethod
    def attendance_count(db):
        today = date.today()
        return db.query(func.count(Attendance.attendance_id)).filter(
            Attendance.isPresent == 1,  # change is_present -> status
            cast(Attendance.check_in_time, Date) == today
        ).scalar()

    @staticmethod
    def attendance_count_by_manager_id(db: Session, manager_id: int) -> int:
        today = date.today()
        return db.query(func.count(Attendance.attendance_id)).filter(
            Attendance.is_present == True,
            Attendance.manager_id == manager_id,
            cast(Attendance.check_in_time, Date) == today
        ).scalar()

    @staticmethod
    def pending_leaves_count(db: Session, status: str) -> int:
        return db.query(func.count(Leave.leave_id)).filter(Leave.status == status).scalar()

    @staticmethod
    def leaves_count_by_manager_id(db: Session, status: str, manager_id: int) -> int:
        today = date.today()
        return db.query(func.count(Leave.leave_id)).filter(
            Leave.status == status,
            Leave.manager_id == manager_id,
            cast(Leave.start_date, Date) == today
        ).scalar()
