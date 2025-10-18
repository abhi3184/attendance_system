from enum import Enum
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from models.leave import LeaveStatus

class AddleaveRequestDTO(BaseModel):
    emp_id: int
    leave_type_id : int
    start_date: date
    end_date: date
    manager_id: int
    reason: Optional[str] = None

class LeaveUpdate(BaseModel):
    leave_id: int
    status: str
    approved_by: str

class LeaveUpdateHr(BaseModel):
    leave_id: int
    status: str

class LeaveResponseDTO(BaseModel):
    leave_id: int
    emp_id: int
    leave_type_id: int
    first_name: Optional[str] = None
    leave_type: Optional[str] = None
    start_date: date
    end_date: date
    reason: Optional[str] = None
    manager_status: str
    hr_status: Optional[str] = None   # <-- make optional
    total_days: int
    used_days: int
    applied_on: datetime
    last_name: Optional[str] = None
    department : Optional[str] = None


    class Config:
        orm_mode = True

class LeaveSummaryResp(BaseModel):
    leave_type: str
    total_days: int
    used_days: int
    remaining_days: int


class LeaveStatus(str, Enum):
    pending = "Pending"
    approved = "Approved By Manager"
    rejected = "Rejected"

class addLeaveBalanceReq(BaseModel):
    leave_name:str
    total_days: int


class LeaveTypeResponse(BaseModel):
    leave_type_id: int
    leave_name: str
    total_days: int

    class Config:
        orm_mode = True 