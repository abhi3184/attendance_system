from .registration.employeeRegistration_repo import employeRegistrationRepository
from .auth.login_repo import loginRepo
from .attendance.Ip_repo import IPRepo
from .attendance.attendance_repo import AttendanceRepo
from .leave.leave_repo import LeaveRepo

__all__ = [
    "ForgotPassRepository",  
    "OTPRepository", 
    "employeRegistrationRepository",
    "employeeRepos",
    "loginRepo",
    "IPRepo",
    "AttendanceRepo",
    "LeaveRepo",
]