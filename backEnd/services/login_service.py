
from models.index import employeeTable
from utils.HashPasswor import verify_password
from schemas.index import Login
from sqlalchemy import select
from fastapi import APIRouter, HTTPException
from repository.index import loginRepo
from sqlalchemy.orm import Session
from utils.jwt_handler import create_access_token
from models.index import roles

class loginService:
    @staticmethod
    def login_user(db: Session,req: Login):
        employee = loginRepo.user_login(db,req)

        if not employee:
            raise HTTPException(status_code=400, detail="User not found")

        if not verify_password(req.password, employee.password):
            raise HTTPException(status_code=400, detail="Incorrect password")
        
        role_obj = db.query(roles).filter(roles.c.role_id == employee.roles_id).first()
        if not role_obj:
            raise HTTPException(status_code=400, detail="Role not found")
        role_name = role_obj.role 

        token = create_access_token({
            "sub": employee["emailId"],
            "id": employee["emp_id"],
            "name": f"{employee.firstName} {employee.lastName}",
            "role": role_name
        })
        return {"success": True, "employee": {"id": employee.emp_id},"access_token": token, "token_type": "bearer"}
