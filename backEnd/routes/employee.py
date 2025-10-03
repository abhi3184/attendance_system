from fastapi import APIRouter, Depends, HTTPException,Security,status
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.index import UpdateUserRequest
from services.index import employeeService
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.deps import get_current_user,role_checker

employee = APIRouter()
bearer_scheme = HTTPBearer()

@employee.get("/getAllEmployee")
async def get_all_users(
    current_user = Depends(role_checker(["admin", "hr"])),
    db: Session = Depends(get_db)
):
    return employeeService.get_all_users(db)


@employee.get("/getEmployeeById/{id}")
async def get_users_by_id(id: int, db: Session = Depends(get_db)):
    return employeeService.get_user_by_id(db, id)

@employee.get("/getEmployeeByEmail")
async def check_user_exist_by_email(email: str, db: Session = Depends(get_db)):
    try:
        user = employeeService.check_user_exist_by_email(db, email)
        if not user:
            # 404 Not Found
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User not found"
            )
        return {"success": True, "data": user}
    except HTTPException as he:
        raise he
    except Exception as e:
        # 500 Server Error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@employee.put("/updateEmployee/{user_id}")
async def update_user(user_id: int, payload: UpdateUserRequest,
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)):
    result = employeeService.update_user(db, user_id, payload)
    return result


@employee.delete("/deleteEmployee/{user_id}")
async def delete_user(user_id: int, 
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)):
    result = employeeService.delete_user(db, user_id)
    return result
