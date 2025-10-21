# schemas/dashboard.py
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

# ----- Simple count response -----
class CountResponse(BaseModel):
    success: bool
    count: int

# ----- Attendance summary for UI -----
class AttendanceSummary(BaseModel):
    date: date
    status: str             # Present / Absent / Holiday / Weekend
    total_hr: Optional[float] = None
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    is_holiday: Optional[bool] = False
    is_weekend: Optional[bool] = False
    description: Optional[str] = None

# ----- Leaves summary -----
class LeaveSummary(BaseModel):
    leave_id: int
    emp_id: int
    start_date: date
    end_date: date
    status: str
    reason: Optional[str] = None
    manager_id: Optional[int] = None
