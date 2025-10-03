import time
import requests
from utils.GenerateOTP import send_email, generate_otp

class OTPRepository:
    otp_store = {}         # { email: { "otp": ..., "expires_at": ... } }
    mobile_otp_store = {}  # { mobile: { "otp": ..., "expires_at": ... } }

    # ------------------ EMAIL ------------------
    @staticmethod
    def send_email_otp(payload):
        otp = generate_otp()
        expires_at = time.time() + 300  # 5 min
        send_email(payload.email, otp)
        OTPRepository.otp_store[payload.email] = {"otp": otp, "expires_at": expires_at}
        return {"success": True, "message": "OTP sent successfully", "otp": otp, "expires_at": expires_at}

    @staticmethod
    def verify_email_otp(payload):
        record = OTPRepository.otp_store.get(payload.email)
        if not record:
            return {"success": False, "message": "OTP not sent for this email"}

        if time.time() > record["expires_at"]:
            del OTPRepository.otp_store[payload.email]
            return {"success": False, "message": "Email OTP expired"}

        if payload.otp == record["otp"]:
            del OTPRepository.otp_store[payload.email]  # delete after success
            return {"success": True, "message": "OTP verified successfully"}

        return {"success": False, "message": "Invalid Email OTP"}

    # ------------------ MOBILE ------------------
    @staticmethod
    def send_mobile_otp(payload):
        otp = generate_otp()
        expires_at = time.time() + 300  # 5 min validity

        AUTH_KEY = "469694A8hzS6VaS68cbe45eP1"
        SENDER_ID = "1233"
        ROUTE = "4"
        MOBILE = payload.mobile
        MESSAGE = f"Your OTP is {otp}"

        url = f"https://api.msg91.com/api/sendhttp.php?authkey={AUTH_KEY}&mobiles={MOBILE}&message={MESSAGE}&sender={SENDER_ID}&route={ROUTE}&country=91"
        try:
            requests.get(url)  # ✅ actually send
        except Exception as e:
            return {"success": False, "message": f"Failed to send OTP: {str(e)}"}

        OTPRepository.mobile_otp_store[MOBILE] = {"otp": otp, "expires_at": expires_at}
        return {"success": True, "message": "OTP sent successfully", "otp": otp, "expires_at": expires_at}

    @staticmethod
    def verify_mobile_otp(payload):
        record = OTPRepository.mobile_otp_store.get(payload.mobile)
        if not record:
            return {"success": False, "message": "OTP not sent for this mobile"}

        if time.time() > record["expires_at"]:
            del OTPRepository.mobile_otp_store[payload.mobile]
            return {"success": False, "message": "Mobile OTP expired"}

        if payload.otp == record["otp"]:
            del OTPRepository.mobile_otp_store[payload.mobile]  # delete after success
            return {"success": True, "message": "OTP verified successfully"}

        return {"success": False, "message": "Invalid Mobile OTP"}
