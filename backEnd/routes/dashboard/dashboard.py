from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from config.db import get_db
from services.index import DashboardService
from utils.deps import get_current_user, role_checker
from schemas.index import CountResponse

dashboard = APIRouter()

@dashboard.get("/all_employee_count", response_model=CountResponse)
async def get_all_employee_count(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.all_employees_count(db)


@dashboard.get("/all_managers_count", response_model=CountResponse)
async def get_all_managers_count(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.all_managers_count(db)


@dashboard.get("/attendance_count", response_model=CountResponse)
async def attendance_count(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.attendance_count(db)


@dashboard.get("/attendance_count_by_manager/{manager_id}", response_model=CountResponse)
async def attendance_count_by_manager(
    manager_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.attendance_count_by_manager(db, manager_id)


@dashboard.get("/leaves_count", response_model=CountResponse)
async def leave_count(
    status: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.pending_leaves_count(db, status)