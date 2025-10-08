from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from config.db import get_db
from services.index import OTPService
from schemas.index import EmailOTPVerifyRequest

otp = APIRouter()

@otp.post("/send-otp/{emailId}")
async def send_otp(emailId,db: Session = Depends(get_db)):
    return OTPService.send_email_otp(db,emailId)


@otp.post("/verify-email-otp")
async def verify_email_otp(payload: EmailOTPVerifyRequest,db: Session = Depends(get_db)):
    result = OTPService.verify_email_otp(db,payload)
    return result