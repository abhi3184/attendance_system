import time
from utils.GenerateOTP import send_email, generate_otp

class OTPRepository:
    otp_store = {}  # Stores OTPs in the format {email: {"otp": ..., "expires_at": ...}}

    @staticmethod
    def send_email_otp(email: str):
        otp = generate_otp()
        expires_at = time.time() + 300  # 5 minutes expiry

        # Send OTP via email
        send_email(email, otp)

        # Store OTP in dictionary
        OTPRepository.otp_store[email] = {"otp": otp, "expires_at": expires_at}

        return {
            "success": True,
            "message": "OTP sent successfully",
            "otp": otp,
            "expires_at": expires_at,
        }

    @staticmethod
    def verify_email_otp(email: str, otp: str):
        record = OTPRepository.otp_store.get(email)

        if not record:
            return {"success": False, "message": "OTP not sent for this email"}

        if not isinstance(record, dict):
            return {"success": False, "message": "Invalid OTP record format"}

        # Check expiry
        if time.time() > record["expires_at"]:
            del OTPRepository.otp_store[email]
            return {"success": False, "message": "Email OTP expired"}

        # Check OTP match
        if otp == record["otp"]:
            del OTPRepository.otp_store[email]  # remove OTP after successful verification
            return {"success": True, "message": "OTP verified successfully"}

        return {"success": False, "message": "Invalid Email OTP"}
