import random, string
from utils.HashPasswor import hash_password
from repository.index import EmployeeRegistrationRepository
from utils.registrationEmail import send_registration_email
from schemas.index import AddEmployeeReq, UpdateEmployeeRequest, UpdateEmployeeStatus

class employeeRegistrationService:

    @staticmethod
    def generate_password(length=8):
        """Generate a strong password with upper, lower, digit, special characters."""
        upper = string.ascii_uppercase
        lower = string.ascii_lowercase
        digits = string.digits
        special = "!@#$%^&*"

        password = [
            random.choice(upper),
            random.choice(lower),
            random.choice(digits),
            random.choice(special)
        ]
        all_chars = upper + lower + digits + special
        password += random.choices(all_chars, k=length - 4)
        random.shuffle(password)
        return "".join(password)

    @staticmethod
    def register_full_employee(db, employee: AddEmployeeReq):
        if not isinstance(employee, dict):
            employee = employee.dict()

        emp_fields = ["firstName", "lastName", "emailId", "mobile", "department", "shift", "roles", "manager_id","gender","salary","dateOfBirth","dateOfJoining"]
        emp_data = {k: employee[k] for k in emp_fields if k in employee}

        # Check if employee exists
        exist_res = EmployeeRegistrationRepository.check_user_exist(db, emp_data)
        if exist_res:
            conflicts = exist_res.get("conflicts", [])
            if len(conflicts) == 2:
                return {"success": False, "message": "Email and Mobile already exist"}
            elif "emailId" in conflicts:
                return {"success": False, "message": "Email already exists"}
            elif "mobile" in conflicts:
                return {"success": False, "message": "Mobile already exists"}

        # Generate emp_code
        latest_emp_code = EmployeeRegistrationRepository.get_highest_emp_code(db)
        emp_data["emp_code"] = f"A{int(latest_emp_code[1:]) + 1:02d}" if latest_emp_code else "A01"

        # Generate password
        raw_password = employeeRegistrationService.generate_password()
        emp_data["password"] = hash_password(raw_password)


        emp_res = EmployeeRegistrationRepository.post_user(db, emp_data)
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
        EmployeeRegistrationRepository.add_education(db, edu_data)

        # Insert Address
        addr_data = {
            "emp_id": emp_id,
            "address": employee.get("address"),
            "city": employee.get("city"),
            "state": employee.get("state"),
            "zip_code": employee.get("zip"),
            "contact": employee.get("phoneAlt")
        }
        EmployeeRegistrationRepository.create_address(db, addr_data)

        # Send email
        try:
            send_registration_email(emp_data["emailId"], raw_password, emp_data["firstName"])
        except Exception as e:
            print(f"Failed to send email: {str(e)}")

        return {"success": True, "emp_id": emp_id, "message": f"Employee added successfully. Credentials sent to {emp_data['emailId']}"}

    @staticmethod
    def check_employee_exist(db, email: str, mobile: str):
        res = EmployeeRegistrationRepository.check_user_exist_for_registration(db, email, mobile)
        if res:
            conflicts = res.get("conflicts", [])
            if set(conflicts) == {"emailId", "mobile"}:
                msg = "Email and Mobile already exist"
            elif "emailId" in conflicts:
                msg = "Email already exists"
            elif "mobile" in conflicts:
                msg = "Mobile already exists"
            else:
                msg = "Unknown conflict"
            return {"success": False, "message": msg}
        return {"success": True, "message": "User can be added"}

    @staticmethod
    def get_all_employess(db):
        result = EmployeeRegistrationRepository.get_all_employees(db)
        if result:
            return {"success": True, "data": result, "message": "All employees"}
        return {"success": False, "data": [], "message": "Employees not found"}

    @staticmethod
    def get_employesBy_id(db, emp_id: int):
        result = EmployeeRegistrationRepository.get_employee_by_id(db, emp_id)
        if result:
            return {"success": True, "data": result, "message": "Employee found"}
        return {"success": False, "data": {}, "message": "Employee not found"}

    @staticmethod
    def get_employesBy_manager(db, manager_id: int):
        result = EmployeeRegistrationRepository.get_employee_by_manager(db, manager_id)
        if result:
            return {"success": True, "data": result, "message": "Employees found"}
        return {"success": False, "data": [], "message": "No employees found"}

    @staticmethod
    def get_all_managers(db):
        result = EmployeeRegistrationRepository.get_all_managers(db)
        if result:
            return {"success": True, "data": result, "message": "All managers"}
        return {"success": False, "data": [], "message": "Managers not found"}

    @staticmethod
    def get_all_roles(db):
        result = EmployeeRegistrationRepository.get_all_roles(db)
        if result:
            return {"success": True, "data": result, "message": "All roles"}
        return {"success": False, "data": [], "message": "Roles not found"}

    @staticmethod
    def update_employee(db, payload: UpdateEmployeeRequest):
        existing = EmployeeRegistrationRepository.get_employee_by_id(db, payload.emp_id)
        if not existing:
            return {"success": False, "message": "Employee not found"}
        return EmployeeRegistrationRepository.update_employee(db, payload)

    @staticmethod
    def change_employee_status(db, payload: UpdateEmployeeStatus):
        existing = EmployeeRegistrationRepository.get_employee_by_id(db, payload.emp_id)
        if not existing:
            return {"success": False, "message": "Employee not found"}
        return EmployeeRegistrationRepository.change_stats(db, payload)

    @staticmethod
    def delete_employee(db, emp_id: int):
        EmployeeRegistrationRepository.delete_employee_education(db, emp_id)
        EmployeeRegistrationRepository.delete_employee_address(db, emp_id)
        return EmployeeRegistrationRepository.delete_employee(db, emp_id)
