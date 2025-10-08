
from services.auth.login_service import loginService
from services.registration.employeeRegistration_service import employeeRegistrationService
from services.attendance.attendance_service import AttendanceService
from services.leave.leave_service import LeaveService
from services.holidays.holidays_service import HolidayService
from services.OTP.otp_service import OTPService

__all__ = [
    loginService,
    employeeRegistrationService,
    AttendanceService,
    LeaveService,
    HolidayService,
    OTPService
]