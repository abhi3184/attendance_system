from sqlalchemy import Table, Column, Integer, String
from config.db import meta

employeeTable = Table(
    "employee", meta,
    Column("emp_id", Integer, primary_key=True, autoincrement=True),   
    Column("emp_code", String(50), unique=True, nullable=False),
    Column("firstName", String(100), unique=False, nullable=False),
    Column("lastName", String(100), nullable=False),
    Column("emailId", String(15), unique=True, nullable=False),
    Column("mobile", String(15), unique=True, nullable=False),
    Column("department", String(100), unique=False, nullable=False),
    Column("shift_time", String(100), unique=False, nullable=False),
    Column("status", String(100), unique=False, nullable=False),
    Column("password", String(100), unique=False, nullable=False),
    Column("roles_id", Integer, unique=False, nullable=False),
    Column("manager_id", Integer, unique=False, nullable=False),
    
)
