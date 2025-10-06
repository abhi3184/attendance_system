from datetime import datetime
from typing import List
from fastapi import HTTPException
from models.index import Leave,leaveTypeTable
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
        leave_types = db.query(leaveTypeTable).all() 
        used_leaves = LeaveRepo.get_leave_summary(db, emp_id) 
        used_dict = {ul["leave_type_id"]: ul["used_days"] for ul in used_leaves}

        summary = []
        for lt in leave_types:
            used = used_dict.get(lt.leave_type_id, 0)
            total_days = getattr(lt, "total_days", 12)  
            summary.append(
                LeaveSummaryResp(
                    leave_type=lt.leave_name,
                    total_days=total_days,
                    used_days=used,
                    remaining_days=total_days - used
                )
            )
        return summary