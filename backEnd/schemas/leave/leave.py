# schemas/index.py
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class AddleaveRequestDTO(BaseModel):
    emp_id: int
    leave_type_id: int
    start_date: date
    end_date: date
    reason: str
    manager_id: int

class LeaveResponse(BaseModel):
    leave_id: int
    emp_id: int
    leave_type_id: int
    start_date: date
    end_date: date
    first_name: str
    last_name:str
    total_days: int
    used_days: int
    reason: Optional[str]
    rejected_reason: Optional[str]
    manager_id: int
    manager_status: str
    manager_approved_on: Optional[datetime]
    hr_status: str
    hr_approved_on: Optional[datetime]
    applied_on: datetime

    class Config:
        orm_mode = True

class LeaveSummaryResp(BaseModel):
    leave_type: str
    total_days: int
    used_days: int
    remaining_days: int

class LeaveStatus(str):
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class LeaveUpdate(BaseModel):
    leave_id: int
    status: str  # "Approved", "Rejected", "Pending"
    # optional: who approved
    approved_by: Optional[int] = None

class LeaveUpdateHr(BaseModel):
    leave_id: int
    status: str  # "Approved", "Rejected", "Pending"
    # optional: who approved
    approved_by: Optional[int] = None

class AddLeaveBalanceReq(BaseModel):
    leave_name: str
    total_days: int