from fastapi.security import HTTPBearer
from fastapi import APIRouter,Depends, HTTPException,status
from jose import jwt, JWTError
from schemas.index import Login,UpdatePasswordReq
from services.index import loginService
from sqlalchemy.orm import Session
from config.db import get_db
from config.jwt_config import ALGORITHM, REFRESH_SECRET_KEY
from utils.jwt_handler import create_access_token

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


@authentication.post("/refresh")
def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        emp_id = payload.get("emp_id")
        if emp_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access_token = create_access_token(payload)
    return {"access_token": new_access_token, "token_type": "bearer"}