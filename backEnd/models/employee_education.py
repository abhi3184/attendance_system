from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base_class import Base

class EmployeeEducation(Base):
    __tablename__ = "emp_education"

    education_id = Column(Integer, primary_key=True, autoincrement=True)
    school_name = Column(String(100))
    degree = Column(String(100))
    passing_year = Column(String(10))
    field_of_study = Column(String(100))
    university = Column(String(100))
    location = Column(String(100))
    emp_id = Column(Integer, ForeignKey("employee.emp_id"))

    employee = relationship("Employee", back_populates="education")
