from typing import List, Optional
from sqlalchemy import and_, or_, select, update
from sqlalchemy.orm import Session
from schemas.index import AddleaveRequestDTO,LeaveUpdate,LeaveResponseDTO
from models.index import Leave,leaveTypeTable
from datetime import datetime
from sqlalchemy import func

class LeaveRepo:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def apply_leave(db, leave: Leave):
        db.add(leave)
        db.commit()
        db.refresh(leave)
        return {"success":True,"message":"leave is applied successfully"}
    
    @staticmethod
    def check_existing_leave(db: Session, emp_id: int, start_date, end_date):
        if isinstance(start_date, str):
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        if isinstance(end_date, str):
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        return db.query(Leave).filter(
            Leave.emp_id == emp_id,
            Leave.status != "rejected",
            Leave.start_date <= end_date,
            Leave.end_date >= start_date
        ).first()

    @staticmethod
    def update_leave_status(db, req: LeaveUpdate):
        leave = db.execute(
            select(Leave).where(Leave.leave_id == req.leave_id)
            ).scalar_one_or_none()
        
        if not leave:
            return {"message": "Leave not found"}
        
        leave.status = req.status
        leave.approved_by = req.approved_by
        leave.approved_on = datetime.now()
    
        db.commit()
        db.refresh(leave)
        return {"message": "Leave updated successfully"}
    
    @staticmethod
    def get_leave_by_empId(db: Session, empId: str) -> List[LeaveResponseDTO]:
   
        leaves = db.query(Leave).filter(Leave.emp_id == empId).all()
       
        if not leaves:
            return {"message":"Leaves not found"}

        return [leave.__dict__ for leave in leaves]

    @staticmethod
    def delete_leave(db,leave_Id: int):
        leave = db.query(Leave).filter(Leave.leave_id == leave_Id).first()
        if not leave:
            return {"message":"Leave not found"}
        db.delete(leave)
        db.commit()
        return {"message": f"Leave with id {leave_Id} deleted successfully"}
    

    @staticmethod
    def get_leave_summary(db: Session, emp_id: int):
        result = (
            db.query(
                Leave.leave_type_id,
                func.sum(Leave.used_days).label("used_days")
            )
            .filter(Leave.emp_id == emp_id)
            .group_by(Leave.leave_type_id)
            .all()
        )

        return [{"leave_type_id": r.leave_type_id, "used_days": r.used_days or 0} for r in result]
    

    @staticmethod
    def get_leave_types(db):
        result = db.execute(leaveTypeTable.select()).mappings().all()
        return result
    
    @staticmethod
    def get_total_days_by_leave_type(db,leaveTypeID : int):
        result = db.execute(leaveTypeTable.select().where(leaveTypeTable.c.leave_type_id == leaveTypeID)).mappings().first()
        return result