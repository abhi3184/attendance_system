from fastapi import APIRouter,Depends
from schemas.index import AddEmployeeReq,UpdateEmployeeRequest,EmployeeExistReq,UpdateEmployeeStatus
from fastapi import APIRouter
from services.index import employeeRegistrationService
from sqlalchemy.orm import Session
from config.db import get_db


registration = APIRouter()

reg_otp_store = {} 

@registration.post("/postEmployee")
async def post_user(employee: AddEmployeeReq,db: Session = Depends(get_db)):
    return employeeRegistrationService.register_full_employee(db,employee)

@registration.get("/checkEmployeeExist")
async def check_employee_exist(emailId: str, mobile: str, db: Session = Depends(get_db)):
    return employeeRegistrationService.check_employee_exist(db, emailId, mobile)

@registration.get("/getAllEmployees")
async def get_all_employees(db : Session = Depends(get_db)):
    return employeeRegistrationService.get_all_employess(db)

@registration.get("/getAllManagers")
async def get_all_managers(db : Session = Depends(get_db)):
    return employeeRegistrationService.get_all_managers(db)

@registration.get("/getAllRoles")
async def get_all_managers(db : Session = Depends(get_db)):
    return employeeRegistrationService.get_all_roles(db)

@registration.get("/get_employee_by_id/{emp_id}")
async def get_employee_by_id(emp_id : int, db : Session = Depends(get_db)):
    return employeeRegistrationService.get_employesBy_id(db,emp_id)

@registration.get("/get_employee_by_manager/{managerId}")
async def get_employee_by_manager(managerId : int, db : Session = Depends(get_db)):
    return employeeRegistrationService.get_employesBy_manager(db,managerId)

@registration.put("/updateEmployee")
async def update_user(payload: UpdateEmployeeRequest, db: Session = Depends(get_db)):
    result = employeeRegistrationService.update_employee(db, payload)
    return result


@registration.put("/updateEmployeeStatus")
async def update_user(payload: UpdateEmployeeStatus, db: Session = Depends(get_db)):
    result = employeeRegistrationService.change_employee_status(db, payload)
    return result

@registration.delete("/deleteEmployee")
async def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    return employeeRegistrationService.delete_employee(db, emp_id)
