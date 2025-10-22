
from sqlalchemy import MetaData, Table, Column, Integer, String
from config import db
from models.base_class import Base
from sqlalchemy.orm import relationship

meta = MetaData()

class LeaveType(Base):
    __tablename__ = "leave_type"
    
    leave_type_id = Column(Integer, primary_key=True, index=True)
    leave_name = Column(String(50), unique=True, nullable=False)
    total_days = Column(Integer, nullable=False)


    leaves = relationship("Leave", back_populates="leave_type")
