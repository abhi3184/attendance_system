import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_registration_email(to_email: str, password: str, user_name: str):
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_USER = "abhideshmukh3184@gmail.com"
    SMTP_PASS = "qgrenroazuaxaebv"
    
    subject = "Your Employee Account Details"

    # HTML body
    body = f"""
    <html>
        <head>
            <style>
                .container {{
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 500px;
                    margin: auto;
                }}
                .credentials {{
                    font-size: 16px;
                    font-weight: bold;
                    color: #4a4a4a;
                    margin: 15px 0;
                }}
                .footer {{
                    font-size: 12px;
                    color: #888;
                    text-align: center;
                    margin-top: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome to Our Company!</h2>
                <p>Hello {user_name},</p>
                <p>Your employee account has been created successfully. Here are your login credentials:</p>
                <p>You can change your password also.</p>
                <div class="credentials">
                    <p>Email (Username): {to_email}</p>
                    <p>Password: {password}</p>
                </div>
                
                <div class="footer">
                    &copy; 2025 Your Company Name. All rights reserved.
                </div>
            </div>
        </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg['Subject'] = subject
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    msg.attach(MIMEText(body, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
