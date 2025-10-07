from sqlalchemy.orm import Session
from sqlalchemy import insert, select
from datetime import date, datetime, timedelta
from models.index import holidaysTable 
from schemas.index import AddHolidayReq
from datetime import date as dt_date

class HolidaysRepo:

    def __init__(self, db):
        self.db = db

    @staticmethod
    def get_upcoming_holidays(db):
        today = date.today()
        rows = db.execute(
            select(
                holidaysTable.c.date,
                holidaysTable.c.description
            )
            .where(holidaysTable.c.date > today)
            .order_by(holidaysTable.c.date.asc())
        ).fetchall()

        return [
            {
                "date": str(row.date),
                "description": row.description
            }
            for row in rows
        ]

    @staticmethod
    def get_by_date(db, date):
        result = db.query(holidaysTable).filter(holidaysTable.c.date == date).first()
        return result

    @staticmethod
    def add_holiday(db, req: dict):
        result = db.execute(
            insert(holidaysTable).values(
                date = req.date,
                description = req.description,
                type = req.type,
            )
        )
        db.commit()
        inserted_id = result.lastrowid
        return db.query(holidaysTable).filter(holidaysTable.c.holidays_id == inserted_id).first()
    

    @staticmethod
    def get_all_holidays(db):
        result = db.execute(holidaysTable.select()).mappings().all()
        return result