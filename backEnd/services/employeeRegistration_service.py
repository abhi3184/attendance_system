
from utils.GenerateOTP import generate_otp, send_email
import time
from schemas.index import EmailOTPRequest,EmailOTPVerifyRequest,MobileOTPRequest,VerifyMobileOTPRequest
from models.index import employeeTable
from fastapi import APIRouter, Depends, HTTPException, Body
import requests
from utils.otp_store import reg_otp_store,reg_mobile_otp_store
from sqlalchemy import select
from utils.HashPasswor import hash_password, verify_password
from schemas.index import AddEmployeeReq
from repository.index import employeRegistrationRepository

class employeeRegistrationService:
    @staticmethod
    def post_user(db,employee: AddEmployeeReq):
        isExist = employeRegistrationRepository.check_user_exist(db,employee)
        if isExist: 
            print("Exist",isExist)
            conflicts = isExist.get("conflicts", [])
            if len(conflicts) == 2:
                message = "Email and already exist"
            elif "emailId" in conflicts:
                message = "Email already exists"
            elif "mobile" in conflicts:
                message = "Mobile already exists"
            else:
                message = "User already exists"
            return {"success": False, "message": message}
    
        try:
            latest_emp_code = employeRegistrationRepository.get_highest_emp_code(db)
            if latest_emp_code:
                number = int(latest_emp_code[1:]) + 1
                new_emp_code = f"A{number:02d}"
                employee.emp_code = new_emp_code          
            else:
                new_emp_code = "A01"
                employee.emp_code = new_emp_code          

            response = employeRegistrationRepository.post_user(db,employee)
            print("Object", response)
            return response
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")