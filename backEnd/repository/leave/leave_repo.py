from typing import List, Optional
from sqlalchemy import and_, or_, select, update
from sqlalchemy.orm import Session
from schemas.index import AddleaveRequestDTO,LeaveUpdate,LeaveResponseDTO
from models.index import Leave,leaveTypeTable
from datetime import datetime

class LeaveRepo:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def apply_leave(self, leave: Leave):
        self.db.add(leave)
        self.db.commit()
        self.db.refresh(leave)
        return leave
    
    @staticmethod
    def check_existing_leave(self, emp_id: int, start_date, end_date):
        print("DEBUG → start_date:", start_date, type(start_date))
        print("DEBUG → end_date:", end_date, type(end_date))

        if isinstance(start_date, str):
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        if isinstance(end_date, str):
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        return (
            self.db.query(Leave)
            .filter(
                Leave.emp_id == emp_id,
                Leave.status != "rejected",
                or_(
                    and_(Leave.start_date == start_date),
                    and_(Leave.start_date == end_date),
                )
            )
            .first()
    )

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
        query = (
            db.query(
                Leave.leave_id,
                Leave.emp_id,
                Leave.start_date,
                Leave.end_date,
                Leave.status,
                Leave.total_days,
                Leave.used_days,
                leaveTypeTable.c.leave_name.label("leave_type_name")
            )
            .join(leaveTypeTable, Leave.leave_type_id == leaveTypeTable.c.leave_type_id)
            .filter(Leave.emp_id == emp_id)
        )

        results = query.all()
        return [dict(r._mapping) for r in results] if results else []