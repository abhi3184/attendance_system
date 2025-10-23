from sqlalchemy.orm import Session, joinedload
from schemas.employee_DTO.getEmployeeRes_DTO import AddressResponse, EducationResponse
from models.index import Employee, Roles, EmployeeEducation, EmployeeAddress
from schemas.index import (
    UpdateEmployeeStatus,
    UpdateEmployeeRequest,
    GetManagerRes,
    EmployeeResponse,
    EmployeeAddressReponse,
    EmployeeEducationResponse
)
from sqlalchemy import or_
from utils.HashPasswor import hash_password

class EmployeeRegistrationRepository:

    @staticmethod
    def validate_employee(db: Session, emp_id: int):
        employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
        if not employee:
            return None
        return EmployeeResponse(
            emp_id=employee.emp_id,
            emp_code=employee.emp_code,
            firstName=employee.firstName,
            lastName=employee.lastName,
            emailId=employee.emailId,
            mobile=employee.mobile,
            department=employee.department,
            shift=employee.shift_time,
            status=employee.status,
            role = str(employee.roles_id),
            manager_id=employee.manager_id
        )

    @staticmethod
    def check_user_exist(db: Session, employee: dict):
        existing = db.query(Employee).filter(
            or_(
                Employee.emailId == employee.get("emailId"),
                Employee.mobile == employee.get("mobile")
            )
        ).first()
        if not existing:
            return None
        conflicts = []
        if existing.emailId == employee.get("emailId"):
            conflicts.append("emailId")
        if existing.mobile == employee.get("mobile"):
            conflicts.append("mobile")
        return {"exists": True, "conflicts": conflicts}

    @staticmethod
    def check_user_exist_for_registration(db: Session, email: str, mobile: str):
        existing = db.query(Employee).filter(
            or_(
                Employee.emailId == email,
                Employee.mobile == mobile
            )
        ).first()
        if not existing:
            return None
        conflicts = []
        if existing.emailId == email:
            conflicts.append("emailId")
        if existing.mobile == mobile:
            conflicts.append("mobile")
        return {"exists": True, "conflicts": conflicts}

    @staticmethod
    def get_all_managers(db: Session):
        managers = db.query(Employee).filter(Employee.roles_id == 2).all()
        return [GetManagerRes(emp_id=m.emp_id, firstName=m.firstName, lastName=m.lastName,department=m.department) for m in managers]

    @staticmethod
    def post_user(db: Session, emp_data: dict):
        print("Data", emp_data)
        new_employee = Employee(
            emp_code=emp_data["emp_code"],
            firstName=emp_data["firstName"],
            lastName=emp_data["lastName"],
            emailId=emp_data["emailId"],
            mobile=emp_data["mobile"],
            department=emp_data["department"],
            shift_time=emp_data["shift"],
            status="Active",
            password=emp_data["password"],
            roles_id=emp_data["roles"],
            manager_id=emp_data["manager_id"],
            gender = emp_data["gender"],
            salary = emp_data["salary"],
            dateOfBirth = emp_data["dateOfBirth"],
            dateOfJoining = emp_data["dateOfJoining"],
        )

        print("Request",new_employee)
        
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return {
            "success": True,
            "data": new_employee,
            "emp_id": new_employee.emp_id,
            "message": "Employee registered successfully"
        }

    @staticmethod
    def add_education(db: Session, edu_data: dict):
        new_edu = EmployeeEducation(**edu_data)
        db.add(new_edu)
        db.commit()
        db.refresh(new_edu)
        return new_edu.education_id

    @staticmethod
    def create_address(db: Session, addr_data: dict):
        new_addr = EmployeeAddress(**addr_data)
        db.add(new_addr)
        db.commit()
        db.refresh(new_addr)
        return new_addr.id_address

    @staticmethod
    def get_all_employees(db: Session):
        return db.query(Employee).filter(Employee.emp_id != 1).all()

    @staticmethod
    def get_employee_by_id(db: Session, emp_id: int):
        employee = (
            db.query(Employee)
            .options(joinedload(Employee.address), joinedload(Employee.education))
            .filter(Employee.emp_id == emp_id)
            .first()
        )
        if not employee:
            return None

        addr = employee.address[0] if employee.address else None
        edu = employee.education[0] if employee.education else None

        return {
            "emp_code": employee.emp_code,
            "firstName": employee.firstName,
            "lastName": employee.lastName,
            "emailId": employee.emailId,
            "mobile": employee.mobile,
            "department": employee.department,
            "shift": employee.shift_time,
            "status": employee.status,
            "address": AddressResponse(
                address=addr.address if addr else None,
                city=addr.city if addr else None,
                state=addr.state if addr else None,
                zipCode=addr.zip_code if addr else None,
                contact=addr.contact if addr else None,
            )
            if addr
            else None,
            "education": EducationResponse(
                school_name=edu.school_name if edu else None,
                degree=edu.degree if edu else None,
                passingYear=edu.passing_year if edu else None,
                fieldOfStudy=edu.field_of_study if edu else None,
                university=edu.university if edu else None,
                location=edu.location if edu else None,
            )
            if edu
            else None,
        }

    @staticmethod
    def update_employee(db: Session, payload: UpdateEmployeeRequest):
        employee = db.query(Employee).filter(Employee.emp_id == payload.emp_id).first()
        if not employee:
            return {"success": False, "message": "Employee not found"}

        employee.firstName = payload.firstName
        employee.lastName = payload.lastName
        employee.department = payload.department
        employee.shift_time = payload.shift
        employee.roles_id = payload.roles
        employee.manager_id = payload.manager_id

        db.commit()
        return {"success": True, "message": "Employee updated successfully"}

    @staticmethod
    def get_employee_by_manager(db: Session, manager_id: int):
        return db.query(Employee).filter(Employee.manager_id == manager_id).all()

    @staticmethod
    def get_all_roles(db: Session):
        return db.query(Roles).all()

    @staticmethod
    def get_highest_emp_code(db: Session):
        employee = db.query(Employee).order_by(Employee.emp_id.desc()).first()
        if employee:
            return employee.emp_code
        return None

    @staticmethod
    def change_status(db: Session, payload: UpdateEmployeeStatus):
        employee = db.query(Employee).filter(Employee.emp_id == payload.emp_id).first()
        if not employee:
            return {"success": False, "message": "Employee not found"}
        employee.status = payload.status
        db.commit()
        return {"success": True, "message": "Employee status updated"}

    @staticmethod
    def delete_employee(db: Session, emp_id: int):
        employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
        if employee:
            db.delete(employee)
            db.commit()
        return {"message": "Employee deleted successfully"}

    @staticmethod
    def delete_employee_education(db: Session, emp_id: int):
        education = db.query(EmployeeEducation).filter(EmployeeEducation.emp_id == emp_id).all()
        for e in education:
            db.delete(e)
        db.commit()
        return {"message": "Employee education deleted successfully"}

    @staticmethod
    def delete_employee_address(db: Session, emp_id: int):
        addresses = db.query(EmployeeAddress).filter(EmployeeAddress.emp_id == emp_id).all()
        for a in addresses:
            db.delete(a)
        db.commit()
        return {"message": "Employee address deleted successfully"}
