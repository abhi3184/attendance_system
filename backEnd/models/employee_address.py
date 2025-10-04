from sqlalchemy import Table, Column, Integer, String
from config.db import meta

employeeAddressTable = Table(
    "emp_address", meta,
    Column("id_address", Integer, primary_key=True, autoincrement=True),   
    Column("address", String(50), unique=False, nullable=False),
    Column("city", String(100), unique=False, nullable=False),
    Column("state", String(100), nullable=False),
    Column("zip_code", String(15), unique=False, nullable=False),
    Column("conatct", String(15), unique=False, nullable=False),
    Column("emp_id", String(100), unique=False, nullable=False),
)
