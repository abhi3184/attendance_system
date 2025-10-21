from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base_class import Base

class EmployeeAddress(Base):
    __tablename__ = "emp_address"

    id_address = Column(Integer, primary_key=True, autoincrement=True)
    address = Column(String(100))
    city = Column(String(100))
    state = Column(String(100))
    zip_code = Column(String(15))
    contact = Column(String(15))
    emp_id = Column(Integer, ForeignKey("employee.emp_id"))

    employee = relationship("Employee", back_populates="address")
