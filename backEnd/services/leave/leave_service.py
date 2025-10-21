from collections import defaultdict
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
    def apply_leave(db, req : AddleaveRequestDTO):
        existing = LeaveRepo.check_existing_leave(db, req.emp_id, req.start_date, req.end_date)
        if existing:
            return {"message":"Leave already applied for give dates"}
        total_days = LeaveRepo.get_total_days_by_leave_type(db,req.leave_type_id)

        start_date = datetime.strptime(req.start_date, "%Y-%m-%d").date() if isinstance(req.start_date, str) else req.start_date
        end_date = datetime.strptime(req.end_date, "%Y-%m-%d").date() if isinstance(req.end_date, str) else req.end_date

        used_days = (end_date - start_date).days + 1

        leave = Leave(
            emp_id = req.emp_id,
            leave_type_id = req.leave_type_id,
            total_days = total_days.total_days,
            used_days = used_days,
            start_date = req.start_date,
            end_date = req.end_date,
            reason = req.reason,
            applied_on = datetime.now(),
            manager_id = req.manager_id,
        )
        return LeaveRepo.apply_leave(db, leave)
    
    @staticmethod
    def update_leave_status(db,req: LeaveUpdate):
        return LeaveRepo.update_leave_status(db,req)
        
    @staticmethod
    def get_leave_by_empId(db: Session, empId: str) -> dict:
        leaves = LeaveRepo.get_leaves_by_empId(db, empId)

        if not leaves:
            return {"success": False, "data": [], "message": "Leaves not found"}

        # Calculate total used_days per leave_type_id
        leave_type_used = defaultdict(int)
        for leave in leaves:
            leave_type_used[leave.leave_type_id] += leave.used_days

        leaves_list = []
        latest_leave_id = max(leave.leave_id for leave in leaves)

        for leave in leaves:
            # If this is the latest leave for this type, calculate remaining_days considering all used_days
            if leave.leave_id == latest_leave_id:
                remaining_days = leave.total_days - leave_type_used[leave.leave_type_id]
            else:
                remaining_days = leave.total_days - leave.used_days  # Historical entry

            leaves_list.append({
                "leave_id": leave.leave_id,
                "emp_id": leave.emp_id,
                "start_date": leave.start_date,
                "end_date": leave.end_date,
                "status": leave.status,
                "reason": leave.reason,
                "leave_type": leave.leave_type_name,
                "total_days": leave.total_days,
                "used_days": leave.used_days,
                "remaining_days": remaining_days
            })

        return {"success": True, "data": leaves_list, "message": "Data fetched successfully"}
    
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
    
    @staticmethod
    def get_all_leave_type(db :Session):
        result = LeaveRepo.get_leave_types(db)
        if not result:
            return {"success":False,"data":'',"message":"leave type not found"}
        return {"success":True,"data":result,"message":"leave type not found"}
    
    @staticmethod
    def get_all_leaves(db:Session):
        result = LeaveRepo.get_all_leaves(db)
        return result
        