from .auth.login_repo import LoginRepo
from .attendance.Ip_repo import IPRepo
from .attendance.attendance_repo import AttendanceRepo
from .leave.leave_repo import LeaveRepo
from .holidays.holidays_repo import HolidaysRepo
from .OTP.otpRepo import OTPRepository
from .dashboard.dashboard import DashboardRepo
from .registration.employeeRegistration_repo import EmployeeRegistrationRepository


__all__ = [
    "ForgotPassRepository",  
    "OTPRepository", 
    "EmployeeRegistrationRepository",
    "employeeRepos",
    "LoginRepo",
    "IPRepo",
    "AttendanceRepo",
    "LeaveRepo",
    "HolidaysRepo",
    "OTPRepository",
    "DashboardRepo"
]