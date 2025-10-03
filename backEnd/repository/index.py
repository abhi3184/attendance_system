from .forgetPassword_repo import ForgotPassRepository
from .otp_repo import OTPRepository
from .employeeRegistration_repo import employeRegistrationRepository
from .employee_repo import employeeRepos
from .login_repo import loginRepo
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
    "LeaveRepo"
]