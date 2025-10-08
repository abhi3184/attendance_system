import random
from email.mime.text import MIMEText
import smtplib
from email.mime.multipart import MIMEMultipart
from utils.emailBody import get_otp_email_body,get_otp_email_body_text
def generate_otp():
    return str(random.randint(100000, 999999))


def send_email(to_email: str, otp: str):
    # Replace with your SMTP credentials
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_USER = "abhideshmukh3184@gmail.com"
    SMTP_PASS = "qgrenroazuaxaebv"

    subject = "Your OTP Code"

    msg = MIMEMultipart("alternative")
    msg['Subject'] = subject
    msg['From'] = SMTP_USER
    msg['To'] = to_email


    html_body = get_otp_email_body(otp, SMTP_USER)
    text_body = get_otp_email_body_text(otp, SMTP_USER)

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)