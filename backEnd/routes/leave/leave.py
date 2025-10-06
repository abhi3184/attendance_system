from fastapi import APIRouter, Depends, HTTPException,Security,status
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.index import AddleaveRequestDTO,LeaveUpdate,LeaveSummaryResp,LeaveResponseDTO
from services.index import LeaveService
from typing import Dict, List


leave = APIRouter()

@leave.post("/addleave",)
def add_leave(request: AddleaveRequestDTO, db: Session = Depends(get_db)):
    return LeaveService.apply_leave(db,request)

@leave.get("/getAllLeaveTypes")
def get_all_leave_types(db : Session = Depends(get_db)):
    return LeaveService.get_all_leave_type(db)

@leave.put("/update_status")
def update_leave_status(req: LeaveUpdate,db: Session = Depends(get_db)):
    return LeaveService.update_leave_status(db,req)

@leave.get("/getLeavesById")
async def get_users_by_id(empId: int, db: Session = Depends(get_db)):
    return LeaveService.get_leave_by_empId(db, empId)

@leave.delete("/deleteLeave")
async def delete_leave(leave_Id: int, db: Session = Depends(get_db)):
    return LeaveService.delete_leave(db, leave_Id)

@leave.get("/leave_summary/{emp_id}", response_model=List[LeaveSummaryResp])
def get_leave_summary(emp_id: int, db: Session = Depends(get_db)):
    return LeaveService.get_leave_summary(db, emp_id)

@leave.get("/get_all_leaves", response_model=List[LeaveResponseDTO])
def get_leave_leaves(db: Session = Depends(get_db)):
    return LeaveService.get_all_leaves(db)