# repository/holidays_repo.py
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, delete
from models.index import Holidays

class HolidaysRepo:

    @staticmethod
    def get_by_date(db: Session, holiday_date):
        return db.query(Holidays).filter(Holidays.date == holiday_date).first()

    @staticmethod
    def add_holiday(db: Session, req):
        stmt = insert(Holidays).values(
            date=req.holiday_date,
            description=req.description,
            type=req.type
        )
        result = db.execute(stmt)
        db.commit()
        return result

    @staticmethod
    def get_all_holidays(db: Session):
        return db.query(Holidays).all()

    @staticmethod
    def get_upcoming_holidays(db: Session):
        from datetime import date as dt_date
        today = dt_date.today()
        return db.query(Holidays).filter(Holidays.date > today).order_by(Holidays.date.asc()).all()

    @staticmethod
    def update_holiday(db: Session, holiday_id: int, data: dict):
        stmt = (
            update(Holidays)
            .where(Holidays.holidays_id == holiday_id)
            .values(
                date=data.get("date"),
                description=data.get("description"),
                type=data.get("type")
            )
        )
        result = db.execute(stmt)
        db.commit()
        return result

    @staticmethod
    def delete_holiday(db: Session, holiday_id: int):
        stmt = delete(Holidays).where(Holidays.holidays_id == holiday_id)
        result = db.execute(stmt)
        db.commit()
        return result
