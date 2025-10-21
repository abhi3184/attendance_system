
from .registration.employeeRegistration import registration
from .auth.auth import authentication
from .attendance.attendance import attendance
from .leave.leave import leave
from .holidays.holidays import holidays
from .OTP.otp import otp
from .dashboard.dashboard import dashboard

all_routes = [
    registration,
    authentication,
    attendance,
    leave,
    holidays,
    otp,
    dashboard
]