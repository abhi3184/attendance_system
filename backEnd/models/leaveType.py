
from sqlalchemy import MetaData, Table, Column, Integer, String
from config import db


meta = MetaData()

leaveTypeTable = Table(
    "leave_type", meta,
    Column("leave_type_id", Integer, primary_key=True),
    Column("leave_name", String(50), unique=True, nullable=False),
    Column("total_days", Integer, nullable=False)
)