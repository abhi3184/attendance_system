def get_otp_email_body(otp: str, user_name: str = "User") -> str:
    """
    Returns a HTML body for OTP email.
    otp: str - 6-digit OTP
    user_name: str - optional, defaults to "User"
    """
    return f"""
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
        .otp {{
            font-size: 24px;
            font-weight: bold;
            color: #4a4a4a;
            letter-spacing: 4px;
            text-align: center;
            margin: 20px 0;
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
        <h2>OTP Verification</h2>
        <p>Hello {user_name},</p>
        <p>Use the following One-Time Password (OTP) to verify your account:</p>
        <div class="otp">{otp}</div>
        <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
          &copy; 2025 Your Company Name. All rights reserved.
        </div>
      </div>
    </body>
</html>
"""


def get_otp_email_body_text(otp: str, user_name: str):
    return f"""
OTP Verification

Hello {user_name},

Use the following One-Time Password (OTP) to verify your account:

{otp}

This OTP is valid for 5 minutes. Please do not share it with anyone.

If you did not request this, please ignore this email.

-----------------------------
© 2025 Your Company Name. All rights reserved.
"""