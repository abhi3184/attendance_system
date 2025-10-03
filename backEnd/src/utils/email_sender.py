import smtplib
from email.message import EmailMessage
from src.schemas.mail_config import MailConfig

def send_email_otp(mail_config: MailConfig, recipient_email: str, otp: str):
    msg = EmailMessage()
    msg['Subject'] = "Your OTP Code"
    msg['From'] = mail_config.MAIL_USERNAME
    msg['To'] = recipient_email
    msg.set_content(f"Your OTP is: {otp}")

    if mail_config.MAIL_USE_SSL:
        server = smtplib.SMTP_SSL(mail_config.MAIL_SERVER, mail_config.MAIL_PORT)
    else:
        server = smtplib.SMTP(mail_config.MAIL_SERVER, mail_config.MAIL_PORT)
        if mail_config.MAIL_USE_TLS:
            server.starttls()

    server.login(mail_config.MAIL_USERNAME, mail_config.MAIL_PASSWORD)
    server.send_message(msg)
    server.quit()
