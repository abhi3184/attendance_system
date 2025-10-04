from .employee_DTO.addEmployeeReq_DTO import AddEmployeeReq,EmployeeExistReq,AddEmployeeEducationReq
from .attendance.checkInReq_DTO import CheckIn
from .leave.leave import AddleaveRequestDTO,LeaveUpdate,LeaveResponseDTO
from .employee_DTO.updateEmployeeReq_DTO import UpdateEmployeeRequest,UpdateEmployeeStatus
from .auth.auth_DTO import Login
from .employee_DTO.getManagerRes_DTO import GetManagerRes

all_schemas = [
    Login,
    EmployeeExistReq,
    CheckIn,
    AddEmployeeEducationReq,
    AddEmployeeReq,
    AddleaveRequestDTO,
    LeaveUpdate,
    LeaveResponseDTO,
    UpdateEmployeeRequest,
    GetManagerRes,
    UpdateEmployeeStatus
]