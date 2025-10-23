# services/leave_service.py
from requests import Session
from repository.index import LeaveRepo
from models.index import Leave, LeaveType
from schemas.index import AddleaveRequestDTO, LeaveUpdate, LeaveSummaryResp
from collections import defaultdict
from datetime import datetime
from typing import List

class LeaveService:

    @staticmethod
    def apply_leave(db, req: AddleaveRequestDTO):
        existing = LeaveRepo.check_existing_leave(db, req.emp_id, req.start_date, req.end_date)
        if existing:
            return {"success": False, "message": "Leave already applied for these dates"}

        total_days_record = LeaveRepo.get_total_days_by_leave_type(db, req.leave_type_id)
        total_days = total_days_record.total_days if total_days_record else 12
        used_days = (req.end_date - req.start_date).days + 1

        leave = Leave(
            emp_id=req.emp_id,
            leave_type_id=req.leave_type_id,
            used_days=used_days,
            start_date=req.start_date,
            end_date=req.end_date,
            reason=req.reason,
            applied_on=datetime.now(),
            manager_status="Pending",
            hr_status="Pending",
            manager_id=req.manager_id
        )
        return LeaveRepo.apply_leave(db, leave)

    @staticmethod
    def update_leave_status_by_manager(db, req: LeaveUpdate):
        leave = LeaveRepo.get_leave_By_id(db, req.leave_id)
        if not leave:
            return {"success": False, "message": "Leave not found"}
        leave.manager_status = req.status
        leave.manager_approved_on = datetime.now()
        LeaveRepo.save_leave(db, leave)
        return {"success": True, "message": f"Leave {req.status.lower()} successfully"}

    @staticmethod
    def update_leave_status_by_Hr(db, req):
        leave = LeaveRepo.get_leave_By_id(db, req.leave_id)
        if not leave:
            return {"success": False, "message": "Leave not found"}
        leave.hr_status = req.status
        leave.hr_approved_on = datetime.now()
        LeaveRepo.save_leave(db, leave)
        return {"success": True, "message": f"Leave {req.status.lower()} successfully"}

    @staticmethod
    def get_leave_summary(db, emp_id: int) -> List[LeaveSummaryResp]:
        leave_types = LeaveRepo.get_leave_types(db)
        used_leaves = LeaveRepo.get_leaves_by_empId(db, emp_id)
        used_dict = defaultdict(int)
        for ul in used_leaves:
            used_dict[ul.leave_type_id] += ul.used_days

        summary = []
        for lt in leave_types:
            used = used_dict.get(lt.leave_type_id, 0)
            summary.append(LeaveSummaryResp(
                leave_type=lt.leave_name,
                total_days=lt.total_days,
                used_days=used,
                remaining_days=lt.total_days - used
            ))
        return summary

    @staticmethod
    def get_all_leave_type(db):
        types = LeaveRepo.get_leave_types(db)
        return {"success": True, "data": types, "message": "Leave types fetched successfully"}

    @staticmethod
    def get_all_leaves(db):
        try:
            return LeaveRepo.get_all_leaves(db)
        except Exception as e:
            raise Exception(f"Error fetching leaves: {str(e)}")

    @staticmethod
    def delete_leave(db, leave_id):
        return LeaveRepo.delete_leave(db, leave_id)

    @staticmethod
    def add_leave_type(db, req):
        existing = LeaveRepo.get_leave_types(db)
        for ex in existing:
            if ex.leave_name.lower() == req.leave_name.lower():
                return LeaveRepo.update_leave_balance(db, ex, req.total_days)
        leave_type = LeaveType(leave_name=req.leave_name, total_days=req.total_days)
        return LeaveRepo.add_leave_balance(db, leave_type)
    


    def get_leave_by_empId(db: Session, empId: int) -> dict:
        leaves = LeaveRepo.get_leaves_by_empId(db, empId)

        if not leaves:
            return {"success": False, "data": [], "message": "Leaves not found"}

        print("MyLeaves",leaves)
        leave_type_used = defaultdict(int)
        for leave in leaves:
            leave_type_used[leave.leave_type_id] += leave.used_days

        leaves_list = []
        latest_leave_id = max(leave.leave_id for leave in leaves)

        leave_name = ''
        leaveTypes = LeaveRepo.get_leave_type_by_id(db, leave.leave_type_id)
        if leaveTypes:
            leave_name = leaveTypes.leave_name
        else:
            leave_name = "Unknown"
        for leave in leaves:
            # If this is the latest leave for this type, calculate remaining_days considering all used_days
            if leave.leave_id == latest_leave_id:
                remaining_days = leave.total_days - leave_type_used[leave.leave_type_id]
            else:
                remaining_days = leave.total_days - leave.used_days 

            leaves_list.append({
                "leave_id": leave.leave_id,
                "emp_id": leave.emp_id,
                "start_date": leave.start_date,
                "end_date": leave.end_date,
                "hr_status": leave.hr_status,
                "manager_status" : leave.manager_status,
                "reason": leave.reason,
                "leave_type": leave_name,
                "total_days": leave.total_days,
                "used_days": leave.used_days,
                "remaining_days": remaining_days
            })

        return {"success": True, "data": leaves_list, "message": "Data fetched successfully"}
    
    def get_leaves_by_manager_id(db: Session, manager_id: int):
        return LeaveRepo.get_leaves_by_manager_id(db, manager_id)
    
   
