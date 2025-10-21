# routes/leave_route.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from routes.attendance.attendance import status
from schemas.leave.leave import LeaveResponse
from config.db import get_db
from schemas.index import LeaveUpdateHr, AddLeaveBalanceReq
from schemas.index import AddleaveRequestDTO, LeaveUpdate
from services.index import LeaveService
from utils.deps import get_current_user
from typing import List

leave = APIRouter()

@leave.post("/addleave")
def add_leave(request: AddleaveRequestDTO, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.apply_leave(db, request)

@leave.put("/update_status_By_manager")
def update_leave_status_by_manager(req: LeaveUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.update_leave_status_by_manager(db, req)

@leave.put("/update_status_By_HR")
def update_leave_status_by_HR(req: LeaveUpdateHr, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.update_leave_status_by_Hr(db, req)

@leave.get("/leave_summary/{emp_id}", response_model=List)
def get_leave_summary(emp_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.get_leave_summary(db, emp_id)

@leave.get("/get_all_leave_types")
def get_all_leave_types(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.get_all_leave_type(db)

@leave.get("/get_all_leaves")
def get_all_leaves(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        leaves = LeaveService.get_all_leaves(db)
        return {
            "success": True,
            "message": "Leaves fetched successfully",
            "data": leaves or []
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@leave.delete("/delete_leave/{leave_id}")
def delete_leave(leave_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.delete_leave(db, leave_id)

@leave.post("/add_leave_balance")
def add_leave_balance(req: AddLeaveBalanceReq, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LeaveService.add_leave_type(db, req)
