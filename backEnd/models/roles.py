from sqlalchemy import Table, Column, Integer, String
from config import db

roles = Table(
    "roles", db.meta,
    Column("role_id", Integer, primary_key=True),
    Column("role", String(50), unique=True, nullable=False)
)