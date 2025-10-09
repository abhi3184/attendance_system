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
    status: LeaveStatus
    approved_by: str

class LeaveResponseDTO(BaseModel):
    leave_id: int
    emp_id: int
    leave_type_id: int
    first_name: Optional[str] = None
    leave_type: Optional[str] = None
    start_date: date
    end_date: date
    reason: Optional[str]
    status: str
    applied_on: datetime
    approved_by: Optional[str]
    approved_on: Optional[datetime]
    last_name: Optional[str] = None


    class Config:
        orm_mode = True

class LeaveSummaryResp(BaseModel):
    leave_type: str
    total_days: int
    used_days: int
    remaining_days: int


class LeaveStatus(str, Enum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"