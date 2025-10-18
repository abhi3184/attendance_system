
from sqlalchemy import MetaData, Table, Column, Integer, String
from config import db
from sqlalchemy.orm import declarative_base

meta = MetaData()
Base = declarative_base()
class LeaveType(Base):
    __tablename__ = "leave_type"
    
    leave_type_id = Column(Integer, primary_key=True, index=True)
    leave_name = Column(String(50), unique=True, nullable=False)
    total_days = Column(Integer, nullable=False)
