from collections import defaultdict
from datetime import datetime
from typing import List
from fastapi import HTTPException
from schemas.leave.leave import LeaveUpdateHr,addLeaveBalanceReq
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
            manager_status = "Pending",
            manager_id = req.manager_id
        )
        return LeaveRepo.apply_leave(db, leave)
    
    @staticmethod
    def update_leave_status_by_manager(db,req: LeaveUpdate):
        leave = LeaveRepo.get_leave_By_id(db,req)
        if not leave:
            return {"success": False, "message": "Leave not found"}
        leave.manager_status = req.status
        leave.manager_approved_on = datetime.now()

        LeaveRepo.save_leave(db, leave)

        return {
            "success": True,
            "message": f"Leave {req.status.lower()} successfully",
            "leave_id": leave.leave_id,
        }
    
    @staticmethod
    def update_leave_status_by_Hr(db,req: LeaveUpdateHr):
        leave = LeaveRepo.get_leave_By_id(db,req)
        if not leave:
            return {"success": False, "message": "Leave not found"}
        leave.hr_status = req.status
        leave.hr_approved_on = datetime.now()
        LeaveRepo.save_leave(db, leave)

        return {
            "success": True,
            "message": f"Leave {req.status.lower()} successfully",
            "leave_id": leave.leave_id,
        }
    
    @staticmethod
    def get_leave_by_empId(db: Session, emp_Id):
        result = LeaveRepo.get_leaves_by_empId(db, emp_Id)
        if not result.get("success"):
            return result

        leaves = result["data"]
        if not leaves:
            return {"success": False, "data": [], "message": "Leaves not found"}
        leave_type_used = defaultdict(int)
        for leave in leaves:
            leave_type_used[leave["leave_type"]] += leave["used_days"]

        leaves_list = []
        latest_leave_id = max(leave["leave_id"] for leave in leaves)

        for leave in leaves:
            if leave["leave_id"] == latest_leave_id:
                remaining_days = leave["total_days"] - leave_type_used[leave["leave_type"]]
            else:
                remaining_days = leave["total_days"] - leave["used_days"]

            leaves_list.append({
                **leave,
                "remaining_days": remaining_days
            })

        return {"success": True, "data": leaves_list, "message": "Data fetched successfully"}
    
    @staticmethod
    def get_leave_by_managerID(db: Session, manager_id: str) -> dict:
        result = LeaveRepo.get_leave_by_manger_id(db, manager_id)

        if not result.get("success"):
            return result

        leaves = result["data"]
        if not leaves:
            return {"success": False, "data": [], "message": "Leaves not found"}

        # Calculate total used_days per leave_type
        leave_type_used = defaultdict(int)
        for leave in leaves:
            leave_type_used[leave["leave_type"]] += leave["used_days"]

        leaves_list = []
        latest_leave_id = max(leave["leave_id"] for leave in leaves)

        for leave in leaves:
            if leave["leave_id"] == latest_leave_id:
                remaining_days = leave["total_days"] - leave_type_used[leave["leave_type"]]
            else:
                remaining_days = leave["total_days"] - leave["used_days"]

            leaves_list.append({
                **leave,
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
    def get_all_leaves(db: Session):
        # Fetch all leaves from repository
        leaves = LeaveRepo.get_all_leaves(db)  # this returns a list of DTOs

        if not leaves:
            return {"success": False, "data": [], "message": "Leaves not found"}

        # Track used days per employee per leave type
        leave_type_used = defaultdict(int)  # key: (emp_id, leave_type_id)
        # Track latest leave_id per employee per leave type
        latest_leave_map = {}  # key: (emp_id, leave_type_id) -> leave_id

        for leave in leaves:
            key = (leave.emp_id, leave.leave_type_id)
            leave_type_used[key] += leave.used_days
            if key not in latest_leave_map or leave.leave_id > latest_leave_map[key]:
                latest_leave_map[key] = leave.leave_id

        # Prepare final list with remaining_days
        leaves_list = []
        for leave in leaves:
            key = (leave.emp_id, leave.leave_type_id)
            if leave.leave_id == latest_leave_map[key]:
                # Latest leave: remaining_days = total_days - total used_days
                remaining_days = leave.total_days - leave_type_used[key]
            else:
                # Older leaves: remaining_days = total_days - used_days
                remaining_days = leave.total_days - leave.used_days

            leaves_list.append({
                **leave.__dict__,  # convert DTO to dict
                "remaining_days": remaining_days
            })

        return {"success": True, "data": leaves_list, "message": "Data fetched successfully"}
    

    def add_leave_type(db, payload: addLeaveBalanceReq) -> Leave:
        existing = LeaveRepo.get_leave_by_type(db,payload)
        if existing:
            print("exist",existing)
            update = LeaveRepo.update_leave_balance(db,existing,payload.total_days)
            return update
        return LeaveRepo.add_leave_balance(payload.leave_name, payload.total_days)