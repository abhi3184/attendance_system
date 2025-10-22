# models/holidays.py
from sqlalchemy import Column, Integer, String
from models.base_class import Base
class Holidays(Base):
    __tablename__ = "holidays"

    holidays_id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(String(50), unique=True, nullable=False)
    description = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
