# Simple in-memory store (email -> otp)
otp_store = {}

def save_otp(email: str, otp: str):
    otp_store[email] = otp

def verify_otp(email: str, otp: str) -> bool:
    stored = otp_store.get(email)
    if stored and stored == otp:
        del otp_store[email]  # delete after verification
        return True
    return False

reg_otp_store = {}

# For registration mobile OTP
reg_mobile_otp_store = {}
