# repository/leave_repo.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.index import Employee
from models.index import Leave, LeaveType
from datetime import datetime

class LeaveRepo:

    @staticmethod
    def apply_leave(db: Session, leave: Leave):
        db.add(leave)
        db.commit()
        db.refresh(leave)
        return {"success": True, "message": "Leave applied successfully"}

    @staticmethod
    def check_existing_leave(db: Session, emp_id: int, start_date, end_date):
        return db.query(Leave).filter(
            Leave.emp_id == emp_id,
            Leave.manager_status != "Rejected",
            Leave.start_date <= end_date,
            Leave.end_date >= start_date
        ).first()

    @staticmethod
    def save_leave(db: Session, leave: Leave):
        db.add(leave)
        db.commit()
        db.refresh(leave)
        return leave

    @staticmethod
    def get_leaves_by_empId(db: Session, emp_id: int):
        result = db.query(Leave).filter(Leave.emp_id == emp_id).all()
        return result

    @staticmethod
    def get_leave_types(db: Session):
        return db.query(LeaveType).all()

    @staticmethod
    def get_total_days_by_leave_type(db: Session, leave_type_id: int):
        return db.query(LeaveType).filter(LeaveType.leave_type_id == leave_type_id).first()

    @staticmethod
    def get_all_leaves(db: Session):
        leaves = (
            db.query(
                Leave.leave_id,
                Leave.start_date,
                Leave.end_date,
                Leave.used_days,
                Leave.manager_status,
                Employee.department,
                Employee.firstName,
                Employee.lastName,
                LeaveType.leave_name,
                LeaveType.total_days
            )
            .join(Employee, Leave.emp_id == Employee.emp_id)
            .join(LeaveType, Leave.leave_type_id == LeaveType.leave_type_id)
            .all()
        )

        # Convert tuples/rows to dict
        result = []
        for l in leaves:
            result.append({
                "leave_id": l[0],
                "start_date": l[1],
                "end_date": l[2],
                "used_days": l[3],
                "manager_status" : l[4],
                "department": l[5],
                "firstName": l[6],
                "lastName": l[7],
                "leave_name": l[8],
                "total_days": l[9]
            })

        return result
    
    @staticmethod
    def get_leave_By_id(db: Session, leave_id: int):
        return db.query(Leave).filter(Leave.leave_id == leave_id).first()
    
    @staticmethod 
    def get_leave_type_by_id(db: Session, leave_type_id: int):
        return db.query(LeaveType).filter(LeaveType.leave_type_id == leave_type_id).first()

    @staticmethod
    def delete_leave(db: Session, leave_id: int):
        leave = db.query(Leave).filter(Leave.leave_id == leave_id).first()
        if leave:
            db.delete(leave)
            db.commit()
            return {"success": True, "message": "Leave deleted successfully"}
        return {"success": False, "message": "Leave not found"}
    
    @staticmethod
    def add_leave_balance(db: Session, leave_type: LeaveType):
        db.add(leave_type)
        db.commit()
        db.refresh(leave_type)
        return leave_type

    @staticmethod
    def update_leave_balance(db: Session, existing_leave: LeaveType, total_days: int):
        existing_leave.total_days = total_days
        db.add(existing_leave)
        db.commit()
        db.refresh(existing_leave)
        return existing_leave
    


    

    
