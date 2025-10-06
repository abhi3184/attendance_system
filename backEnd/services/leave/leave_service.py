from datetime import datetime
from typing import List
from fastapi import HTTPException
from models.index import Leave
from schemas.index import AddleaveRequestDTO,LeaveUpdate,LeaveSummaryResp
from repository.index import LeaveRepo
from sqlalchemy.orm import Session
from repository.index import LeaveRepo
class LeaveService:
    def __init__(self, db: Session):
        self.repo = LeaveRepo(db)

    @staticmethod
    def apply_leave(self, request: AddleaveRequestDTO):
        
        existing = self.repo.check_existing_leave(request.emp_id, request.start_date, request.end_date)
        if existing:
            raise HTTPException(status_code=400, detail="Leave already applied for given dates")

        leave = Leave(
            emp_id = request.emp_id,
            leave_type_id = request.leave_type_id,
            start_date = request.start_date,
            end_date = request.end_date,
            reason = request.reason,
            applied_on = datetime.now()
        )
        return self.repo.apply_leave(leave)
    
    @staticmethod
    def update_leave_status(db,req: LeaveUpdate):
        return LeaveRepo.update_leave_status(db,req)
    
    @staticmethod
    def get_leave_by_empId(db: Session, emp_Id):
        return LeaveRepo.get_leave_by_empId(db, emp_Id)
    
    @staticmethod
    def delete_leave(db: Session, leave_Id):
        return LeaveRepo.delete_leave(db, leave_Id)
    

    @staticmethod
    def get_leave_summary(db: Session, emp_id: int) -> List[LeaveSummaryResp]:
        leaves = LeaveRepo.get_leave_summary(db, emp_id)
        if not leaves:
            return []

        summary = {}
        for leave in leaves:
            lt_name = leave["leave_type_name"]
            total_days = leave.get("total_days", 0)
            used_days = leave.get("used_days", 0)

            # Initialize if not already present
            if lt_name not in summary:
                summary[lt_name] = {
                    "leave_type": lt_name,
                    "total_days": total_days,
                    "used_days": used_days,
                    "remaining_days": total_days - used_days
                }

        return [LeaveSummaryResp(**val) for val in summary.values()]