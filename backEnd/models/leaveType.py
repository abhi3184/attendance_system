from sqlalchemy import Table, Column, Integer, String
from config import db

leaveTypeTable = Table(
    "leave_type", db.meta,
    Column("leave_type_id", Integer, primary_key=True),
    Column("leave_name", String(50), unique=True, nullable=False)
)