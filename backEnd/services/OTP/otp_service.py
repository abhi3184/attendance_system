import time
from fastapi import HTTPException
from repository.index import OTPRepository, LoginRepo
from sqlalchemy.orm import Session
from schemas.index import EmailOTPVerifyRequest

class OTPService:

    @staticmethod
    def send_email_otp(db: Session, emailId: str):
        # Check if user exists
        user = LoginRepo.user_exist_by_email(db, emailId)
        if not user:
            return {"success": False, "message": "Email ID not found"}

        try:
            return OTPRepository.send_email_otp(emailId)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send email OTP: {str(e)}")

    @staticmethod
    def verify_email_otp(db: Session, payload: EmailOTPVerifyRequest):
        email = payload.email
        otp = payload.otp

        record = OTPRepository.otp_store.get(email)
        if not record:
            return {"success": False, "message": "OTP not sent for this email"}

        if not isinstance(record, dict):
            return {"success": False, "message": "Invalid OTP record format"}

        # Check expiry
        if time.time() > record["expires_at"]:
            del OTPRepository.otp_store[email]
            return {"success": False, "message": "Email OTP expired"}

        # Verify OTP
        if otp == record["otp"]:
            del OTPRepository.otp_store[email]
            return {"success": True, "message": "OTP verified successfully"}

        return {"success": False, "message": "Invalid Email OTP"}
