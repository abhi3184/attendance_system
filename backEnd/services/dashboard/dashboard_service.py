from repository.index import dashboardRepo

class DashboardService:

    @staticmethod
    def all_employees_count(db):
        count = dashboardRepo.all_employee_count(db)
        return {"success":True,"count": count}
    
    @staticmethod
    def all_managers_count(db):
        count = dashboardRepo.all_managers_count(db)
        return {"success":True,"count": count}
    
    @staticmethod
    def attendance_count(db):
        count = dashboardRepo.attendance_count(db)
        return {"success":True,"count": count}
    
    @staticmethod
    def attendance_count_by_manager(db,manager_id):
        count = dashboardRepo.attendance_count_by_manager_id(db,manager_id)
        return {"success":True,"count": count}
    
    @staticmethod
    def pending_leaves_count(db,status):
        count = dashboardRepo.pending_leaves_count(db,status)
        return {"success":True,"count": count}
    
    @staticmethod
    def leaves_count_by_manager(db,status,manager_id):
        count = dashboardRepo.leaves_count_by_manager_id(db,status,manager_id)
        return {"success":True,"count": count}