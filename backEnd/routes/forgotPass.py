from fastapi import APIRouter,Depends
from models.index import employeeTable
from schemas.index import Employee,Login,EmailOTPRequest,MobileOTPRequest,EmailOTPVerifyRequest,UpdatePasswordReq,VerifyEmailOTPRequest,VerifyMobileOTPRequest
from fastapi import APIRouter
from services.index import ForgotPasswordService
from config.db import get_db
from sqlalchemy.orm import Session

forgotPass = APIRouter()

@forgotPass.post("/send-email-otp")
async def send_email_otp(payload: EmailOTPRequest,db: Session = Depends(get_db)):
    return ForgotPasswordService.send_email_otp(db,payload)

@forgotPass.post("/verify-email-otp")
async def verify_email_otp(payload: EmailOTPVerifyRequest,db: Session = Depends(get_db)):
    result = ForgotPasswordService.verify_email_otp(db,payload)
    return result

@forgotPass.post("/resend-email-otp")
async def resend_email_otp(payload: EmailOTPRequest,db: Session = Depends(get_db)):
    return ForgotPasswordService.resend_email_otp(db,payload)

@forgotPass.put("/update-password")
async def update_password(req:UpdatePasswordReq,db: Session = Depends(get_db)):
    return ForgotPasswordService.update_password(db,req)