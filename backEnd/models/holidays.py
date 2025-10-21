# models/holidays.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Holidays(Base):
    __tablename__ = "holidays"

    holidays_id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(String(50), unique=True, nullable=False)
    description = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
