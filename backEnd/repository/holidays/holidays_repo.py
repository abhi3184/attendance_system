# repository/holidays_repo.py
from datetime import date, timedelta
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
    


    @staticmethod
    def get_holidays_in_range(db: Session, start_date: str, end_date: str):
        return db.query(Holidays).filter(
            Holidays.date >= start_date,
            Holidays.date <= end_date
        ).all()



    @staticmethod
    def get_weekly_holidays_for_manager(db: Session, date_filter: str):
        today = date.today()

        if date_filter.lower() == "today":
            start_date = today
        elif date_filter.lower() == "yesterday":
            start_date = today - timedelta(days=1)
        elif date_filter.lower() == "weekly":
            start_date = today - timedelta(days=7)
        elif date_filter.lower() == "monthly":
            start_date = today - timedelta(days=30)
        else:
            start_date = None

        query = select(Holidays.date, Holidays.description)

        if start_date:
            query = query.where(Holidays.date >= start_date)

        rows = db.execute(query).fetchall()

        # ✅ Safe conversion (handle both str and date objects)
        return {
            (datetime.fromisoformat(row.date).date() if isinstance(row.date, str) else row.date): row.description
            for row in rows
        }