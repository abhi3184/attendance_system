from repository.index import HolidaysRepo

class HolidayService:

    @staticmethod
    def add_holidays(db, req):
        isExist = HolidaysRepo.get_by_date(db,req.date)
        if isExist:
            return {"success":False,"message":"Holiday already added for this date"}
        emp_res = HolidaysRepo.add_holiday(db, req)
        return emp_res

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