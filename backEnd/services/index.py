
from services.auth.login_service import LoginService
from services.registration.employeeRegistration_service import employeeRegistrationService
from services.attendance.attendance_service import AttendanceService
from services.leave.leave_service import LeaveService
from services.holidays.holidays_service import HolidayService
from services.OTP.otp_service import OTPService
from services.dashboard.dashboard_service import DashboardService

__all__ = [
    LoginService,
    employeeRegistrationService,
    AttendanceService,
    LeaveService,
    HolidayService,
    OTPService,
    DashboardService
]