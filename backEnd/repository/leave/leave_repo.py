from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy import and_, or_, select, update
from sqlalchemy.orm import Session
from schemas.index import AddleaveRequestDTO,LeaveUpdate,LeaveResponseDTO,LeaveStatus,addLeaveBalanceReq
from models.index import Leave,LeaveType,employeeTable
from datetime import datetime
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

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
            Leave.manager_status != "rejected",
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
        return {"success":True,"message": "Leave updated successfully"}

    @staticmethod    
    def get_leaves_by_empId(db: Session, empId: int):
        try:
            # Query the database
            result = (
                db.query(
                    Leave.leave_id,
                    Leave.emp_id,
                    Leave.leave_type_id,
                    Leave.start_date,
                    Leave.end_date,
                    Leave.reason,
                    Leave.manager_status,
                    Leave.hr_status,
                    Leave.applied_on,
                    Leave.total_days,
                    Leave.used_days,
                    LeaveType.c.leave_name.label("leave_type")  # map to DTO
                )
                .join(LeaveType, Leave.leave_type_id == LeaveType.c.leave_type_id)
                .filter(Leave.emp_id == empId)
                .order_by(Leave.start_date.desc())
                .all()
            )

            # Convert result to list of dicts
            leaves_list = []
            for row in result:
                leaves_list.append({
                    "leave_id": row.leave_id,
                    "emp_id": row.emp_id,
                    "leave_type_id": row.leave_type_id,
                    "first_name": getattr(row, "first_name", None),
                    "last_name": getattr(row, "last_name", None),
                    "leave_type": getattr(row, "leave_type", None),
                    "start_date": row.start_date,
                    "end_date": row.end_date,
                    "reason": row.reason,
                    "manager_status": row.manager_status.value if hasattr(row.manager_status, "value") else str(row.manager_status),
                    "hr_status": row.hr_status.value if hasattr(row.hr_status, "value") else str(row.hr_status),
                    "applied_on": row.applied_on,
                    "total_days" : row.total_days,
                    "used_days": row.used_days
                })

            # ✅ Wrap in response dict
            response = {
                "success": True,
                "data": leaves_list,
                "message": "Data fetched successfully"
            }

            return response

        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    

    @staticmethod    
    def get_leave_by_manger_id(db: Session, managerID: int) -> dict:
        leaves = (
            db.query(
                Leave.leave_id,
                Leave.emp_id,
                Leave.start_date,
                Leave.end_date,
                Leave.manager_status,
                Leave.hr_status,
                Leave.reason,
                Leave.used_days,
                LeaveType.c.leave_name.label("leave_type_name"),
                LeaveType.c.total_days.label("total_days"),
                employeeTable.c.firstName.label("first_name"), 
                employeeTable.c.lastName.label("last_name") 
            )
            .join(LeaveType, Leave.leave_type_id == LeaveType.c.leave_type_id)
            .join(employeeTable, Leave.emp_id == employeeTable.c.emp_id)
            .filter(
                (Leave.manager_id == managerID)
            )
            .all()
        )

        if not leaves:
            return {"success": False, "data": [], "message": "Leaves not found"}

        # Convert result to list of dicts
        leaves_list = [
            {
                "leave_id": leave.leave_id,
                "emp_id": leave.emp_id,
                "start_date": leave.start_date,
                "first_name": leave.first_name,   
                "last_name": leave.last_name, 
                "end_date": leave.end_date,
                "manager_status": leave.manager_status,
                "hr_status": leave.hr_status,
                "reason": leave.reason,
                "leave_type": leave.leave_type_name,
                "total_days":leave.total_days,
                "used_days": leave.used_days,
                "remaining_days": leave.total_days -leave.used_days
            }
            for leave in leaves
        ]

        response = {
            "success": True,
            "data": leaves_list,
            "message": "data fetched successfully"
        }

        return response

    @staticmethod
    def delete_leave(db,leave_Id: int):
        leave = db.query(Leave).filter(Leave.leave_id == leave_Id).first()
        if not leave:
            return {"message":"Leave not found"}
        db.delete(leave)
        db.commit()
        return {"message": f"Leave with id {leave_Id} deleted successfully"}
    
    @staticmethod
    def get_leave_By_id(db,req: int):
        leave = db.query(Leave).filter(Leave.leave_id == req.leave_id).first()
        return leave
    
    @staticmethod
    def save_leave(db: Session, leave: Leave):
        db.add(leave)
        db.commit()
        db.refresh(leave)
        return leave    

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
        result = db.execute(LeaveType.select()).mappings().all()
        return result
    
    @staticmethod
    def get_total_days_by_leave_type(db,leaveTypeID : int):
        result = db.execute(LeaveType.select().where(LeaveType.c.leave_type_id == leaveTypeID)).mappings().first()
        return result
    
    @staticmethod
    def get_all_leaves(db: Session):
        result = (
            db.query(
                Leave.leave_id,
                Leave.emp_id,
                Leave.leave_type_id,
                employeeTable.c.firstName.label("first_name"),
                LeaveType.c.leave_name.label("leave_type"),
                Leave.start_date,
                Leave.end_date,
                Leave.reason,
                Leave.manager_status,
                Leave.hr_status,           # <-- Add this
                Leave.applied_on,
                Leave.total_days,
                Leave.used_days,
                employeeTable.c.lastName.label("last_name"),
                employeeTable.c.department.label("department")
            )
            .join(employeeTable, Leave.emp_id == employeeTable.c.emp_id)
            .join(LeaveType, Leave.leave_type_id == LeaveType.c.leave_type_id)
            .all()
        )

        leaves_list = [
            LeaveResponseDTO(
                leave_id=r[0],
                emp_id=r[1],
                leave_type_id=r[2],
                first_name=r[3],
                leave_type=r[4],
                start_date=r[5],
                end_date=r[6],
                reason=r[7],
                manager_status=r[8],
                hr_status=r[9],        
                applied_on=r[10],
                total_days=r[11],
                used_days=r[12],
                last_name=r[13],
                department=r[14],
            )
            for r in result
        ]

        return leaves_list


    @staticmethod
    def get_leave_by_type(db,payload:addLeaveBalanceReq):
        existing = (
            db.query(LeaveType)
            .filter(func.lower(func.trim(LeaveType.c.leave_name)) == payload.leave_name.strip().lower())
            .first()
        )
        print("Existing LeaveType:", existing)
        return existing
            
    @staticmethod
    def add_leave_balance(db,payload:addLeaveBalanceReq):
        db.add(payload)
        db.commit()
        db.refresh(payload)
        return payload  

    @staticmethod
    def update_leave_balance(db, existing_leave, total_days: int):
        existing_leave.total_days = total_days
        db.add(existing_leave)
        db.commit()
        db.refresh(existing_leave)
        return existing_leave

        