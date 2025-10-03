from fastapi import APIRouter,Depends
from schemas.index import AddEmployeeReq,EmailOTPRequest,MobileOTPRequest,VerifyEmailOTPRequest,VerifyMobileOTPRequest
from fastapi import APIRouter
from services.index import employeeRegistrationService
from sqlalchemy.orm import Session
from config.db import get_db

registration = APIRouter()

reg_otp_store = {} 

@registration.post("/postEmployee")
async def post_user(employee: AddEmployeeReq,db: Session = Depends(get_db)):
    return employeeRegistrationService.post_user(db,employee)
