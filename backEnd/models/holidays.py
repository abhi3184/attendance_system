from sqlalchemy import Table, Column, Integer, String
from config.db import meta

holidaysTable = Table(
    "holidays", meta,
    Column("holidays_id", Integer, primary_key=True, autoincrement=True),   
    Column("date", String(50), unique=True, nullable=False),
    Column("description", String(100), unique=False, nullable=False),
    Column("type", String(100), unique=False, nullable=False),
)
