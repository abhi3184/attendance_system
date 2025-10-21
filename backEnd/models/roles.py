# models/roles.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Roles(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True)
    role = Column(String(50), unique=True, nullable=False)
