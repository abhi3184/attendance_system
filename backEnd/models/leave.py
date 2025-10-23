from sqlalchemy import Column, ForeignKey, Integer, String, Date, DateTime, Enum
from pydantic import BaseModel
from datetime import datetime
import enum
from models.base_class import Base
from sqlalchemy.orm import relationship

class LeaveStatus(str, enum.Enum):
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class Leave(Base):
    __tablename__ = "leaves"

    leave_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(Integer,ForeignKey("employee.emp_id"), nullable=False)
    leave_type_id = Column(Integer,ForeignKey("leave_type.leave_type_id"), nullable=False)
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


    employee = relationship("Employee", back_populates="leaves")
    leave_type = relationship("LeaveType", back_populates="leaves")
