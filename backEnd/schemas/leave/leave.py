from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from models.leave import LeaveStatus

class AddleaveRequestDTO(BaseModel):
    emp_id: int
    leave_type_id : int
    start_date: date
    end_date: date
    reason: Optional[str] = None

class LeaveUpdate(BaseModel):
    leave_id: int
    status: LeaveStatus
    approved_by: str

class LeaveResponseDTO(BaseModel):
    leave_id: int
    emp_id: str
    leave_type_id: int
    start_date: date
    end_date: date
    reason: Optional[str]
    status: LeaveStatus
    applied_on: datetime
    approved_by: Optional[str]
    approved_on: Optional[datetime]

    class Config:
        orm_mode = True
