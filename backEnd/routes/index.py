
from routes.registration.employeeRegistration import registration
from routes.auth.auth import authentication
from .attendance.attendance import attendance
from .leave.leave import leave


all_routes = [
    registration,
    authentication,
    attendance,
    leave
]