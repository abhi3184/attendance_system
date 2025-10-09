from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import Date, cast, delete, func, insert, select
from models.index import employeeTable,attendanceTable,Leave

class dashboardRepo:

    def __init__(self, db):
        self.db = db

    @staticmethod
    def all_employee_count(db):
        stmt = select(func.count()).select_from(employeeTable)
        result = db.execute(stmt)
        total_employees = result.scalar()
        return total_employees
    

    @staticmethod
    def all_managers_count(db):
        stmt = select(func.count()).select_from(employeeTable).where(employeeTable.c.roles_id == 2)
        result = db.execute(stmt)
        total_managers = result.scalar()
        return total_managers
    
    @staticmethod
    def attendance_count(db):
        today = date.today()
        stmt = select(func.count()).select_from(attendanceTable).where(
            (attendanceTable.c.isPresent == 1) &
            (cast(attendanceTable.c.check_in_time, Date) == today)  
        )
        result = db.execute(stmt)
        count = result.scalar()
        return count
    
    @staticmethod
    def attendance_count_by_manager_id(db,manager_id):
        today = date.today()
        stmt = select(func.count()).select_from(attendanceTable).where(
            (attendanceTable.c.isPresent == 1) &
            (attendanceTable.c.manager_id == manager_id) &
            (cast(attendanceTable.c.check_in_time, Date) == today)  
        )
        result = db.execute(stmt)
        count = result.scalar()
        return count
    

    @staticmethod
    def pending_leaves_count(db,status):
        stmt = select(func.count(Leave.leave_id)).where(Leave.status == status)
        result = db.execute(stmt)
        pending_leaves = result.scalar()
        return pending_leaves
    

    @staticmethod
    def leaves_count_by_manager_id(db,status,manager_id):
        today = date.today()
        stmt = select(func.count()).select_from(Leave).where(
            (Leave.status == status) &
            (Leave.manager_id == manager_id) &
            (cast(Leave.start_date, Date) == today)  
        )
        result = db.execute(stmt)
        count = result.scalar()
        return count
    