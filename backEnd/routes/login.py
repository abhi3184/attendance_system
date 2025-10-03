from fastapi import APIRouter,Depends
from schemas.index import Login
from services.index import loginService
from sqlalchemy.orm import Session
from config.db import get_db

authentication = APIRouter()

@authentication.post("/login")
async def login_user(login_user: Login,db: Session = Depends(get_db)):
    return loginService.login_user(db,login_user)
