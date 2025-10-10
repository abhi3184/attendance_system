from typing import List, Optional
from sqlalchemy import and_, or_, select, update
from sqlalchemy.orm import Session
from schemas.index import AddleaveRequestDTO,LeaveUpdate,LeaveResponseDTO,LeaveStatus
from models.index import Leave,leaveTypeTable,employeeTable
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
        return {"success":True,"message": "Leave updated successfully"}

    @staticmethod    
    def get_leaves_by_empId(db: Session, empId: str):
        return (
            db.query(
                Leave.leave_id,
                Leave.emp_id,
                Leave.start_date,
                Leave.end_date,
                Leave.status,
                Leave.reason,
                Leave.used_days,
                Leave.leave_type_id,
                leaveTypeTable.c.leave_name.label("leave_type_name"),
                leaveTypeTable.c.total_days.label("total_days")
            )
            .join(leaveTypeTable, Leave.leave_type_id == leaveTypeTable.c.leave_type_id)
            .filter(Leave.emp_id == empId)  # Latest leave first
            .all()
        )
    

    @staticmethod    
    def get_leave_by_manger_id(db: Session, managerID: int) -> dict:
        leaves = (
            db.query(
                Leave.leave_id,
                Leave.emp_id,
                Leave.start_date,
                Leave.end_date,
                Leave.status,
                Leave.reason,
                Leave.used_days,
                leaveTypeTable.c.leave_name.label("leave_type_name"),
                leaveTypeTable.c.total_days.label("total_days"),
                employeeTable.c.firstName.label("first_name"), 
                employeeTable.c.lastName.label("last_name") 
            )
            .join(leaveTypeTable, Leave.leave_type_id == leaveTypeTable.c.leave_type_id)
            .join(employeeTable, Leave.emp_id == employeeTable.c.emp_id)
            .filter(Leave.manager_id == managerID)
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
                "status": leave.status,
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
    
    @staticmethod
    def get_all_leaves(db: Session):
        result = (
            db.query(
                Leave.leave_id,
                Leave.emp_id,
                Leave.leave_type_id,
                employeeTable.c.firstName.label("first_name"),
                leaveTypeTable.c.leave_name.label("leave_type"),
                Leave.start_date,
                Leave.end_date,
                Leave.reason,
                Leave.status,
                Leave.applied_on,
                Leave.approved_by,
                Leave.approved_on,
                employeeTable.c.lastName.label("last_name"),
            )
            .join(employeeTable, Leave.emp_id == employeeTable.c.emp_id)
            .join(leaveTypeTable, Leave.leave_type_id == leaveTypeTable.c.leave_type_id)
            .filter(Leave.status != "Rejected")
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
                status=r[8],
                applied_on=r[9],
                approved_by=r[10],
                approved_on=r[11],
                last_name=r[12],

            )
            for r in result
        ]
        
        return leaves_list
