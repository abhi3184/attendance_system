from .registration.employeeRegistration_repo import employeRegistrationRepository
from .auth.login_repo import loginRepo
from .attendance.Ip_repo import IPRepo
from .attendance.attendance_repo import AttendanceRepo
from .leave.leave_repo import LeaveRepo
from .holidays.holidays_repo import HolidaysRepo
from .OTP.otpRepo import OTPRepository

__all__ = [
    "ForgotPassRepository",  
    "OTPRepository", 
    "employeRegistrationRepository",
    "employeeRepos",
    "loginRepo",
    "IPRepo",
    "AttendanceRepo",
    "LeaveRepo",
    "HolidaysRepo",
    "OTPRepository"
]