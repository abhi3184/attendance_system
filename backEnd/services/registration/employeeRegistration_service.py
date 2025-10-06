
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy import select
from utils.HashPasswor import hash_password, verify_password
from schemas.index import AddEmployeeReq,UpdateEmployeeRequest,EmployeeExistReq,UpdateEmployeeStatus
from repository.index import employeRegistrationRepository
from sqlalchemy.orm import Session

class employeeRegistrationService:
    def register_full_employee(db, employee):
        if not isinstance(employee, dict):
            employee = employee.dict()

        # Employee main fields
        emp_fields = ["firstName", "lastName", "emailId", "mobile", "department", "shift", "password", "roles", "manager_id"]
        emp_data = {k: employee[k] for k in emp_fields if k in employee}

        # Validate password
        if not emp_data.get("password"):
            raise HTTPException(status_code=400, detail="Password is required")

        # Check if employee exists
        exist_res = employeRegistrationRepository.check_user_exist(db, emp_data)
        if exist_res:
            conflicts = exist_res.get("conflicts", [])
            if len(conflicts) == 2:
                return {"success": False, "message": "Email and Mobile already exist"}
            elif "emailId" in conflicts:
                return {"success": False, "message": "Email already exists"}
            elif "mobile" in conflicts:
                return {"success": False, "message": "Mobile already exists"}

        # Generate emp_code
        latest_emp_code = employeRegistrationRepository.get_highest_emp_code(db)
        if latest_emp_code:
            try:
                number = int(latest_emp_code[1:]) + 1
                emp_data["emp_code"] = f"A{number:02d}"
            except:
                emp_data["emp_code"] = "A01"
        else:
            emp_data["emp_code"] = "A01"

        # Insert Employee
        emp_res = employeRegistrationRepository.post_user(db, emp_data)
        emp_id = emp_res["emp_id"]

        # Insert Education
        edu_data = {
            "school_name": employee.get("schoolName"),
            "university": employee.get("university"),
            "degree": employee.get("degree"),
            "passing_year": employee.get("passingyear"),
            "location": employee.get("location"),
            "field_of_study": employee.get("fieldOfStudy"), 
            "emp_id": emp_id
        }
        employeRegistrationRepository.add_education(db, edu_data)

        # Insert Address
        addr_data_db = {
            "emp_id": emp_id,
            "address": employee.get("address"),
            "city": employee.get("city"),
            "state": employee.get("state"),
            "zip_code": employee.get("zip"),
            "contact": employee.get("phoneAlt")
        }
        employeRegistrationRepository.create(db, addr_data_db)

        return {
            "success": True,
            "emp_id": emp_id,
            "message": "Employee, Education and Address added successfully"
        }
    
    @staticmethod
    def check_employee_exist(db, email: str, mobile: str):
        isExist = employeRegistrationRepository.check_user_exist_for_registration(db, email, mobile)

        if isExist:
            if isExist.get("exists"):
                conflicts = isExist.get("conflicts", [])
                if conflicts == ["emailId", "mobile"] or set(conflicts) == {"emailId", "mobile"}:
                 message = "Email and Mobile already exist"
                elif "emailId" in conflicts:
                    message = "Email already exists"
                elif "mobile" in conflicts:
                    message = "Mobile already exists"
                else:
                    message = "Unknown conflict"

                return {"success": False, "message": message}

        return {"success": True, "message": "User can be added"}

    @staticmethod
    def get_all_employess(db : Session):
        result = employeRegistrationRepository.get_all_employees(db)
        if result:
            return {"success":True,"data":result,"Message":"All employees"}
        return {"success":False,"data":result,"Message":"Employees not found"}
    
    @staticmethod
    def get_employesBy_id(db:Session, emp_id:int):
        result = employeRegistrationRepository.get_employeeby_Id(db,emp_id)
        if result:
            return {"success":True,"data":result,"Message":"Employee by id"}
        return {"success":False,"data":result,"Message":"Employee not found"}
    
    @staticmethod
    def get_employesBy_manager(db:Session, managerId:int):
        result = employeRegistrationRepository.get_employee_by_manager(db,managerId)
        if result:
            return {"success":True,"data":result,"Message":"Employee by id"}
        return {"success":False,"data":result,"Message":"Employee not found"}
    
    @staticmethod
    def get_all_managers(db:Session):
        result = employeRegistrationRepository.get_all_managers(db)
        if result:
            return {"success":True,"data":result,"Message":"All Managers"}
        return {"success":False,"data":result,"Message":"Managers not found"}
    
    @staticmethod
    def update_employee(db: Session, payload:UpdateEmployeeRequest):
        isExist = employeRegistrationRepository.get_employeeby_Id(db,payload.emp_id)

        if not isExist:
            return {"success":False,"data":isExist,"message":"No records found"}
        
        return employeRegistrationRepository.update_employee(db, payload)
    

    @staticmethod
    def get_all_roles(db:Session):
        result = employeRegistrationRepository.get_all_roles(db)
        if result:
            return {"success":True,"data":result,"message":"All Roless"}
        return {"success":False,"data":result,"message":"Roles not found"}
    

    @staticmethod
    def change_employee_status(db: Session, payload:UpdateEmployeeStatus):
        isExist = employeRegistrationRepository.get_employeeby_Id(db,payload.emp_id)

        if not isExist:
            return {"success":False,"data":isExist,"message":"No records found"}
        
        return employeRegistrationRepository.change_stats(db, payload)
    

    @staticmethod
    def delete_employee(db: Session, emp_id):
        education = employeRegistrationRepository.delete_employee_education(db, emp_id)
        if not education:
            return {"success":False,"data":education,"message":"No education found"}
        
        address = employeRegistrationRepository.delete_employee(db, emp_id)
        if not address:
            return {"success":False,"data":address,"message":"No address found"}

        employee = employeRegistrationRepository.delete_employee(db, emp_id)
        if not employee:
            return {"success":False,"data":employee,"message":"No employee found"}
        
        return {"success":True,"message":"Employee deleted successfully"}

    
    