from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from models.base_class import Base

class Employee(Base):
    __tablename__ = "employee"

    emp_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_code = Column(String(50), unique=True, nullable=False)
    firstName = Column(String(100), nullable=False)
    lastName = Column(String(100), nullable=False)
    emailId = Column(String(100), unique=True, nullable=False)
    mobile = Column(String(15), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    shift_time = Column(String(100), nullable=False)
    status = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    roles_id = Column(Integer, nullable=False)
    manager_id = Column(Integer,ForeignKey("employee.emp_id"), nullable=False)
    gender = Column(String(45),nullable=False)
    salary = Column(String(45),nullable=False)
    dateOfBirth = Column(String(45),nullable=False)
    dateOfJoining = Column(String(45),nullable=False)

    # Relationship names must match class names as strings
    address = relationship(
        "EmployeeAddress", back_populates="employee", cascade="all, delete-orphan"
    )
    education = relationship(
        "EmployeeEducation", back_populates="employee", cascade="all, delete-orphan"
    )
    leaves = relationship("Leave", back_populates="employee", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="employee")