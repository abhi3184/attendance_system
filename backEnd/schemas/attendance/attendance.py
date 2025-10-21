# schemas/attendance.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CheckInRequest(BaseModel):
    emp_id: str
    manager_id: int
    ip_address: str

class CheckInResponse(BaseModel):
    success: bool
    message: str
    attendance_id: Optional[int] = None
    check_in_time: Optional[datetime] = None

class CheckOutRequest(BaseModel):
    emp_id: str

class CheckOutResponse(BaseModel):
    success: bool
    message: str
    total_hours: Optional[float] = None
    check_out_time: Optional[datetime] = None

class AttendanceRecord(BaseModel):
    attendance_id: Optional[int]
    emp_id: str
    name: str
    shift: Optional[str]
    check_in_time: Optional[datetime]
    check_out_time: Optional[datetime]
    worked_hours: float
    overtime: float
    status: str
    late: bool
    late_hours: int
    late_minutes: int
