from sqlalchemy import Table, Column, Integer, String
from config.db import meta

attendanceTable = Table(
    "attendance", meta,
    Column("attendance_id", Integer, primary_key=True, autoincrement=True),   
    Column("emp_id", String(50), unique=True, nullable=False),
    Column("check_in_time", String(100), unique=False, nullable=False),
    Column("check_out_time", String(100), nullable=False),
    Column("ip_address", String(15), unique=True, nullable=False),
    Column("isPresent",Integer, nullable=False),
    Column("manager_id",Integer, nullable=False),
    Column("total_hr",Integer, nullable=False),
)
