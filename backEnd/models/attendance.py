from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Attendance(Base):
    __tablename__ = "attendance"

    attendance_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(50), nullable=False)               # employee ID
    check_in_time = Column(DateTime, nullable=False)          # check-in timestamp
    check_out_time = Column(DateTime, nullable=True)          # nullable for active check-ins
    ip_address = Column(String(15), nullable=False)
    isPresent = Column(Integer, default=True)                # True if checked-in
    manager_id = Column(Integer, nullable=False)
    total_hr = Column(Float, default=0.0)                     # fractional hours allowe
