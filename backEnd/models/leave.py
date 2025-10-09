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

    leave_id = Column(Integer, primary_key=True, index=True,nullable=False, autoincrement=True)
    emp_id = Column(Integer, nullable=False)
    leave_type_id = Column(Integer, nullable=False)
    total_days = Column(Integer, nullable=False)
    used_days = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.Pending)
    reason = Column(String, nullable=True)
    applied_on = Column(DateTime, default=datetime.now)
    approved_by = Column(String, nullable=False)
    approved_on = Column(DateTime, nullable=False)
    manager_id = Column(Integer, nullable=False)