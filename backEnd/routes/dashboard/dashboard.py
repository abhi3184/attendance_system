from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from config.db import get_db
from services.index import DashboardService
from utils.deps import get_current_user, role_checker

dashboard = APIRouter()

@dashboard.get("/all_aamployee_count")
async def get_all_employee_count(
    db:Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    ):
    return DashboardService.all_employees_count(db)

@dashboard.get("/all_managers_count")
async def get_all_managers_count(
    db:Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    ):
    return DashboardService.all_managers_count(db)

@dashboard.get("/attendance_count")
async def attendance_count(
    db:Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    ):
    return DashboardService.attendance_count(db)

@dashboard.get("/attendance_count_by_manager/{manager_id}")
async def attendance_count(
    manager_id: int, 
    db:Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    ):
    return DashboardService.attendance_count_by_manager(db,manager_id)

@dashboard.get("/leaves_count")
async def leave_count(
    status,
    db:Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    ):
    return DashboardService.pending_leaves_count(db,status)
