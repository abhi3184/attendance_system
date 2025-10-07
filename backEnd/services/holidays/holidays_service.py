from repository.index import HolidaysRepo

class HolidayService:

    @staticmethod
    def add_holidays(db, req):
        isExist = HolidaysRepo.get_by_date(db,req.date)
        if isExist:
            return {"success":False,"message":"Holiday already added for this date"}
        emp_res = HolidaysRepo.add_holiday(db, req)
        return {"success":True,"message":"Holiday added for this date"}

    @staticmethod
    def get_upcoming_holidays(db):
        upcoming = HolidaysRepo.get_upcoming_holidays(db)
        if not upcoming:
            return {"success":False,"data":upcoming,"message":"There is not any upcoming Holiday"}
        return {
            "success": True,
            "data": upcoming,
            "message": "Upcoming holidays fetched successfully"
        }
    
    @staticmethod
    def get_all_holidays(db):
        result = HolidaysRepo.get_all_holidays(db)
        if not result:
            return {"success":False,"data":result,"message":"There is not any Holiday"}
        return {"success":False,"data":result,"message":"Holidays response"}
    

    @staticmethod
    def delete_holiday(db, holiday_id):
        return HolidaysRepo.delete_holiday(db,holiday_id)
    

    @staticmethod
    def update_holiday(db, holiday_id: int, data: dict):
        existing = HolidaysRepo.get_by_date(db, data["date"])
        if existing and existing.holidays_id != holiday_id:
            return {"success": False, "message": "Holiday Not found"}
        result = HolidaysRepo.update_holiday(db, holiday_id, data)

        if result.rowcount == 0:
            return {"success": False, "message": "Holiday not found"}
        return {"success": True, "message": f"Holiday updated successfully"}
        
    