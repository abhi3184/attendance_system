from fastapi.security import HTTPBearer
from fastapi import APIRouter,Depends, HTTPException,status
from schemas.index import Login,UpdatePasswordReq
from services.index import loginService
from sqlalchemy.orm import Session
from config.db import get_db



authentication = APIRouter()
bearer_scheme = HTTPBearer()


@authentication.get("/getEmployeeByEmail")
async def check_user_exist_by_email(email: str, db: Session = Depends(get_db)):
    return loginService.check_user_exist_by_email(db, email)
    

@authentication.post("/login")
async def login_user(login_user: Login,db: Session = Depends(get_db)):
    return loginService.login_user(db,login_user)

@authentication.put("/update-password")
async def update_password(req:UpdatePasswordReq,db: Session = Depends(get_db)):
    return loginService.update_password(db,req)