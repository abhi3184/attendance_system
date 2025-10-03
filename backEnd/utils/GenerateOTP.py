import random
from email.mime.text import MIMEText
import smtplib

def generate_otp():
    return str(random.randint(100000, 999999))


def send_email(to_email: str, otp: str):
    # Replace with your SMTP credentials
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_USER = "abhideshmukh3184@gmail.com"
    SMTP_PASS = "qgrenroazuaxaebv"

    subject = "Your OTP Code"
    body = f"Your OTP code is: {otp}"

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SMTP_USER
    msg['To'] = to_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)