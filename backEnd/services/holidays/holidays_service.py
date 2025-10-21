# services/holiday_service.py
from repository.index import HolidaysRepo

class HolidayService:

    @staticmethod
    def add_holidays(db, req):
        existing = HolidaysRepo.get_by_date(db, req.holiday_date)
        if existing:
            return {"success": False, "message": "Holiday already exists for this date"}
        HolidaysRepo.add_holiday(db, req)
        return {"success": True, "message": "Holiday added successfully"}

    @staticmethod
    def get_upcoming_holidays(db):
        holidays = HolidaysRepo.get_upcoming_holidays(db)
        if not holidays:
            return {"success": False, "data": [], "message": "No upcoming holidays"}
        return {"success": True, "data": holidays, "message": "Upcoming holidays fetched successfully"}

    @staticmethod
    def get_all_holidays(db):
        holidays = HolidaysRepo.get_all_holidays(db)
        if not holidays:
            return {"success": False, "data": [], "message": "No holidays found"}
        return {"success": True, "data": holidays, "message": "Holidays fetched successfully"}

    @staticmethod
    def update_holiday(db, holiday_id: int, data: dict):
        result = HolidaysRepo.update_holiday(db, holiday_id, data)
        if result.rowcount == 0:
            return {"success": False, "message": "Holiday not found"}
        return {"success": True, "message": "Holiday updated successfully"}

    @staticmethod
    def delete_holiday(db, holiday_id: int):
        result = HolidaysRepo.delete_holiday(db, holiday_id)
        if result.rowcount == 0:
            return {"success": False, "message": "Holiday not found"}
        return {"success": True, "message": "Holiday deleted successfully"}
