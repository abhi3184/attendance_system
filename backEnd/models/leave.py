from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from pydantic import BaseModel
from datetime import datetime
import enum
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class LeaveStatus(str, enum.Enum):
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class Leave(Base):
    __tablename__ = "leaves"

    leave_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(Integer, nullable=False)
    leave_type_id = Column(Integer, nullable=False)
    total_days = Column(Integer, nullable=False)
    used_days = Column(Integer, nullable=False, default=0)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    manager_status = Column(String, nullable=True)
    hr_status = Column(String, nullable=True)
    reason = Column(String, nullable=True)
    applied_on = Column(DateTime, default=datetime.now)
    manager_id = Column(Integer, nullable=False)  
    rejected_reason = Column(String,nullable = True)
    manager_approved_on = Column(Date,nullable = True)
    hr_approved_on = Column(Date,nullable = True)