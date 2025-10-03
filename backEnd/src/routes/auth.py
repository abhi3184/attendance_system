from random import randint
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..models.updatePassReqDTO import UpdatePasswordRequest

# Absolute imports – make sure your folder structure is correct
from ..utils.otp_store import verify_otp  # if you have OTP store utility
from ..utils.otp import OTPVerify  # if needed
from ..config import SessionLocal
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserRead
from ..utils.hash import hash_password, verify_password
from ..schemas.mail_config import MailConfig
from ..utils.email_sender import send_email_otp

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------------- DB Dependency ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- Registration ----------------
@router.get("/isExistiUser")
def is_existing_user(email: str, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == email).first()
    return {"exists": bool(existing), "message": "Email already registered" if existing else "Email not registered"}

from fastapi import HTTPException
import traceback

@router.post("/register", response_model=UserRead)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(User).filter(User.email == user_data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pw = hash_password(user_data.password)
        print("👉 Plain Password:", user_data.password)
        print("👉 Hashed Password:", hashed_pw)

        new_user = User(
            username=user_data.username,
            email=user_data.email,
            password=hashed_pw,
            mobile=user_data.mobile
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        print("❌ Register error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Server error")


# ---------------- Login ----------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"message": "Login successful"}

# ---------------- Get Users ----------------
@router.get("/users", response_model=list[UserRead])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# ---------------- Email OTP ----------------
otp_store = {}  # in-memory OTP storage

def generate_otp():
    return str(randint(100000, 999999))

@router.post("/send-email-otp")
def send_email_otp_endpoint(recipient_email: str = Body(..., embed=True)):
    otp = generate_otp()
    otp_store[recipient_email] = otp
    print(f"Generated OTP for {recipient_email}: {otp}")
    # send_email_otp(recipient_email, otp)  # uncomment if email sending logic is ready
    return {"message": f"OTP sent to {recipient_email}", "otp": otp}

@router.post("/verify-email-otp")
def verify_email_otp(email: str = Body(...), otp: str = Body(...)):
    stored_otp = otp_store.get(email)
    if not stored_otp:
        return {"success": False, "message": "No OTP sent for this email"}
    if stored_otp != otp:
        return {"success": False, "message": "Invalid OTP"}
    del otp_store[email]
    return {"success": True, "message": "OTP verified successfully"}

# ---------------- Mobile OTP ----------------
class MobileRequest(BaseModel):
    mobile: str

def send_mobile_otp(mobile: str, otp: str):
    # Placeholder – integrate MSG91 or real SMS here
    print(f"Sending OTP {otp} to mobile {mobile}")

@router.post("/send-mobile-otp")
def send_mobile_otp_endpoint(request: MobileRequest):
    if not request.mobile.isdigit() or len(request.mobile) != 10:
        raise HTTPException(status_code=400, detail="Invalid mobile number")
    otp = generate_otp()
    otp_store[request.mobile] = otp
    send_mobile_otp(request.mobile, otp)
    return {"success": True, "message": "Mobile OTP sent", "otp": otp}

otp_store = {}  # This stores OTPs temporarily (email/mobile → OTP)

# ---------------- Email/Mobile OTP verification ----------------
@router.post("/verify-otp")
def verify_otp_endpoint(mobile: str = Body(...), otp: str = Body(...)):
    """
    mobile: email or mobile
    otp: 6-digit OTP sent previously
    """
    stored_otp = otp_store.get(mobile)

    if not stored_otp:
        # No OTP sent for this identifier
        raise HTTPException(status_code=400, detail="No OTP sent for this identifier")

    if stored_otp != otp:
        # OTP does not match
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP verified successfully → remove from store
    del otp_store[mobile]
    return {"success": True, "message": "OTP verified successfully"}

@router.put("/update-password")
def update_password(req: UpdatePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash new password
    hashed_pw = hash_password(req.new_password)
    user.password = hashed_pw
    db.commit()
    db.refresh(user)

    return {"success": True, "message": "Password updated successfully"}