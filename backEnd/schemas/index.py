from .emoloyee import Employee, Login
from .emailReq_DTO import EmailOTPRequest, EmailOTPVerifyRequest
from .mobileOTPReq_DTO import MobileOTPRequest
from .verifyEmailOTP import VerifyEmailOTPRequest
from .verifyMobileOTP import VerifyMobileOTPRequest
from .UpdatePasswordReq import UpdatePasswordReq
from .employee_DTO.updateEmployeeReq_DTO import UpdateUserRequest
from .employee_DTO.addEmployeeReq_DTO import AddEmployeeReq
from .attendance.checkInReq_DTO import CheckIn
from .leave.leave import AddleaveRequestDTO,LeaveUpdate,LeaveResponseDTO

all_schemas = [
    CheckIn,
    AddEmployeeReq,
    AddleaveRequestDTO,
    LeaveUpdate,
    LeaveResponseDTO
]