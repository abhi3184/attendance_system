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
    firstName = Column(str, nullable=False)
    lastName = Column(str, nullable=False)
    leave_type_id = Column(Integer, nullable=False)
    total_days = Column(Integer, nullable=False)
    used_days = Column(Integer, nullable=False, default=0)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.Pending)
    reason = Column(String, nullable=True)
    applied_on = Column(DateTime, default=datetime.now)
    approved_by = Column(String, nullable=True)   # काही वेळा leave pending असतो म्हणून nullable=True
    approved_on = Column(DateTime, nullable=True)
    manager_id = Column(Integer, nullable=False)   # काही users कडे manager नसतो म्हणून nullable=True