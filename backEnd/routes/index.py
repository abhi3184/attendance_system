from routes.employee import employee
from routes.forgotPass import forgotPass
from routes.employeeRegistration import registration
from routes.auth.auth import authentication
from .attendance.attendance import attendance
from .leave.leave import leave


all_routes = [
    employee,
    forgotPass,
    registration,
    authentication,
    attendance,
    leave
]