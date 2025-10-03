import random

def generate_otp(length: int = 6) -> str:
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


from pydantic import BaseModel, EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str  # 6-digit OTP


import requests

# ⚡ Replace with your real MSG91 credentials
MSG91_AUTHKEY = "469694A8hzS6VaS68cbe45eP1"
MSG91_TEMPLATE_ID = "68cbe6a7d1278c0d2e06ce43"

def send_test_otp(mobile: str, otp: str):
    """
    Sends OTP using MSG91 and prints full response for debugging
    """
    url = "https://api.msg91.com/api/v5/otp"
    
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authkey": MSG91_AUTHKEY
    }

    payload = {
        "template_id": MSG91_TEMPLATE_ID,
        "mobile": f"91{mobile}",   # India code
        "authkey": MSG91_AUTHKEY,
        "otp": otp
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        print("[MSG91] Status Code:", response.status_code)
        print("[MSG91] Response:", response.text)

        if response.status_code == 200:
            print(f"[MSG91] OTP successfully sent to {mobile}")
        else:
            print(f"[MSG91] OTP failed to send. Check template/auth/mobile.")
    
    except requests.exceptions.RequestException as e:
        print("[MSG91] Exception:", e)

if __name__ == "__main__":
    test_mobile = "9561234040"   # replace with your number
    test_otp = "123456"
    send_test_otp(test_mobile, test_otp)
