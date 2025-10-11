from datetime import timedelta

SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # replace with a secure random string
REFRESH_SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # replace with a secure random string
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7 # token valid for 1 hour
