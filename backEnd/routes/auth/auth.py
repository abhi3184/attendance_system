from fastapi.security import HTTPBearer
from fastapi import APIRouter,Depends, HTTPException,status
from schemas.index import Login
from services.index import loginService, employeeService
from sqlalchemy.orm import Session
from config.db import get_db



authentication = APIRouter()
bearer_scheme = HTTPBearer()


@authentication.get("/getEmployeeByEmail")
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
    

@authentication.post("/login")
async def login_user(login_user: Login,db: Session = Depends(get_db)):
    return loginService.login_user(db,login_user)
