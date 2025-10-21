# services/login_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from utils.HashPasswor import verify_password
from utils.jwt_handler import create_access_token, create_refresh_token
from schemas.index import Login,LoginResponse,EmployeeResponse,UpdatePasswordReq
from models.index import Roles
from repository.index import LoginRepo

class LoginService:

    @staticmethod
    def check_user_exist_by_email(db: Session, email: str):
        result = LoginRepo.user_exist_by_email(db, email)
        if not result:
            return {"success": False, "data": None, "message": "Email not found"}
        return {"success": True, "data": result, "message": "Email found"}

    @staticmethod
    def login_user(db: Session, req: Login):
        employee = LoginRepo.user_login(db, req.login)
        if not employee:
            raise HTTPException(status_code=400, detail="User not found")

        if not verify_password(req.password, employee.password):
            raise HTTPException(status_code=400, detail="Incorrect password")

        role_obj = db.query(Roles).filter(Roles.role_id == employee.roles_id).first()
        if not role_obj:
            raise HTTPException(status_code=400, detail="Role not found")

        role_name = role_obj.role

        employeeData = {
            "sub": employee.emailId,
            "id": employee.emp_id,
            "name": f"{employee.firstName} {employee.lastName}",
            "role": role_name,
            "manager_id": employee.manager_id
        }

        token = create_access_token(employeeData)
        refresh_token = create_refresh_token(employeeData)

        employee_data = EmployeeResponse(
            emp_id=employee.emp_id,
            emp_code=employee.emp_code,
            firstName=employee.firstName,
            lastName=employee.lastName,
            emailId=employee.emailId,
            mobile=employee.mobile,
            department=employee.department,
            shift=employee.shift_time,
            status=employee.status,
            role=role_name,
            manager_id=employee.manager_id
        )

        return {
            "success": True,
            "access_token": token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "employee": employee_data
        }

    @staticmethod
    def update_password(db: Session, req: UpdatePasswordReq):
        user = LoginRepo.user_exist_by_email(db, req.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return LoginRepo.update_password(db, req.email, req.password)
