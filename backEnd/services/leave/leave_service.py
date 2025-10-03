from datetime import datetime
from fastapi import HTTPException
from models.index import Leave
from schemas.index import AddleaveRequestDTO,LeaveUpdate
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