from sqlalchemy import Table, Column, Integer, String
from config.db import meta

employeeEducationTable = Table(
    "emp_education", meta,
    Column("education_id", Integer, primary_key=True, autoincrement=True),   
    Column("school_name", String(50), unique=False, nullable=True),
    Column("degree", String(100), unique=False, nullable=True),
    Column("passing_year", String(100), unique=False, nullable=True),
    Column("field_of_study", String(15), unique=False, nullable=True),
    Column("university", String(15), unique=False, nullable=True),
    Column("location", String(100), unique=False, nullable=True),
    Column("emp_id", String(100), unique=False, nullable=True),
)
