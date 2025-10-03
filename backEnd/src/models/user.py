from sqlalchemy import Column, Integer, String
from ..config import Base

class User(Base):
    __tablename__ = "users"  # table name in MySQL

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    mobile = Column(String(15), unique=True, nullable=False)
