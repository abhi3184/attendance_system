# config/db.py
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:3184@localhost:3306/attendance_db"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
meta = MetaData()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()   
    try:
        yield db 
    finally:
        db.close() 
