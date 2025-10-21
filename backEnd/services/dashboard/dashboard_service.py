# services/dashboard_service.py
from sqlalchemy.orm import Session
from repository.index import DashboardRepo

class DashboardService:

    @staticmethod
    def all_employees_count(db: Session):
        count = DashboardRepo.all_employee_count(db)
        return {"success": True, "count": count}

    @staticmethod
    def all_managers_count(db: Session):
        count = DashboardRepo.all_managers_count(db)
        return {"success": True, "count": count}

    @staticmethod
    def attendance_count(db: Session):
        count = DashboardRepo.attendance_count(db)
        return {"success": True, "count": count}

    @staticmethod
    def attendance_count_by_manager(db: Session, manager_id: int):
        count = DashboardRepo.attendance_count_by_manager_id(db, manager_id)
        return {"success": True, "count": count}

    @staticmethod
    def pending_leaves_count(db: Session, status: str):
        count = DashboardRepo.pending_leaves_count(db, status)
        return {"success": True, "count": count}

    @staticmethod
    def leaves_count_by_manager(db: Session, status: str, manager_id: int):
        count = DashboardRepo.leaves_count_by_manager_id(db, status, manager_id)
        return {"success": True, "count": count}
