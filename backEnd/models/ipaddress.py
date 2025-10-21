# models/ip_address.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class IPAddress(Base):
    __tablename__ = "ip_address"

    ip_address_id = Column(Integer, primary_key=True, autoincrement=True)
    address = Column(String(50), unique=True, nullable=False)
