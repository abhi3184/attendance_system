from sqlalchemy import Table, Column, Integer, String
from config import db

ipAddress = Table(
    "ip_address", db.meta,
    Column("ip_address_id", Integer, primary_key=True, autoincrement=True),
    Column("address", String(50), unique=True, nullable=False)
)