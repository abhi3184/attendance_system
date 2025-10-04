
from models.index import employeeTable,roles,employeeEducationTable,employeeAddressTable
from schemas.index import UpdateEmployeeStatus,UpdateEmployeeRequest,GetManagerRes
from sqlalchemy import delete, insert, or_
from sqlalchemy import select
from utils.HashPasswor import hash_password

class employeRegistrationRepository:

    @staticmethod
    def check_user_exist(db, employee:dict):
        result = db.execute(
            employeeTable.select().where(
                or_(
                    employeeTable.c.emailId == employee.get("emailId"),
                    employeeTable.c.mobile == employee.get("mobile")
                )
            )
        ).mappings().first()

        if not result:
            return None
        conflicts = []
        if result['emailId'] == employee.get("emailId"):
            conflicts.append("emailId")
        if result['mobile'] == employee.get("mobile"):
            conflicts.append("mobile")
        return {"exists": True, "conflicts": conflicts}

    @staticmethod
    def check_user_exist_for_registration(db, email: str, mobile: str):
        result = db.execute(
            employeeTable.select().where(
                or_(
                    employeeTable.c.emailId == email,
                    employeeTable.c.mobile == mobile
                )
            )
        ).mappings().first()

        if not result:
            return None
        conflicts = []
        if result['emailId'] == email:
            conflicts.append("emailId")
        if result['mobile'] == mobile:
            conflicts.append("mobile")
        return {"exists": True, "conflicts": conflicts}

    @staticmethod
    def get_all_managers(db):
        query = (
            employeeTable
            .select()
            .with_only_columns([
                employeeTable.c.emp_id,
                employeeTable.c.firstName,
                employeeTable.c.lastName
            ])
            .where(employeeTable.c.roles_id == 2)
        )

        result = db.execute(query).mappings().all()
        return [GetManagerRes(**row) for row in result]

    @staticmethod
    def get_all_managers(db):
        query = (
            employeeTable
            .select()
            .with_only_columns(
                employeeTable.c.emp_id,
                employeeTable.c.firstName,
                employeeTable.c.lastName
            )
            .where(employeeTable.c.roles_id == 2)
        )
        result = db.execute(query).mappings().all()
        return [GetManagerRes(**row) for row in result]

    @staticmethod
    def post_user(db, emp_data: dict):
        hashed_pw = hash_password(emp_data["password"])
        emp_data["password"] = hashed_pw

        result = db.execute(
            insert(employeeTable).values(
                emp_code = emp_data["emp_code"],
                firstName = emp_data["firstName"],
                lastName = emp_data["lastName"],
                emailId = emp_data["emailId"],
                mobile = emp_data["mobile"],
                department = emp_data["department"],
                shift_time = emp_data["shift"],
                status = "Active",
                password = emp_data["password"],
                roles_id = emp_data["roles"],
                manager_id = emp_data["manager_id"]
            )
        )
        db.commit()
        inserted_id = result.lastrowid

        new_user = db.execute(
            select(employeeTable).where(employeeTable.c.emp_id == inserted_id)
        ).mappings().first()

        return {
            "success": True,
            "data": new_user,
            "emp_id": new_user["emp_id"],
            "message": "Employee registered successfully",
        }

    @staticmethod
    def add_education(db, edu_data: dict):
        result = db.execute(
            insert(employeeEducationTable).values(**edu_data)
        )
        db.commit()
        return result.lastrowid

    @staticmethod
    def create(db, addr_data: dict):
        result = db.execute(
            insert(employeeAddressTable).values(**addr_data)
        )
        db.commit()
        return result.lastrowid

    @staticmethod
    def get_all_employees(db):
        result = db.execute(employeeTable.select()).mappings().all()
        return result
    
    @staticmethod
    def get_employeeby_Id(db, emp_id:int):
        result = db.execute(employeeTable.select().where(employeeTable.c.emp_id == emp_id)).mappings().first()
        return result
    
    @staticmethod
    def update_employee(db, payload : UpdateEmployeeRequest):
        update_data = {
            "firstName": payload.firstName,
            "lastName": payload.lastName,
            "department": payload.department,
            "shift_time": payload.shift,
            "roles_id": payload.roles,
            "manager_id": payload.manager_id
        }
        query = employeeTable.update().where(employeeTable.c.emp_id == payload.emp_id).values(**update_data)
        db.execute(query)
        db.commit() 
        return {"success": True, "message": "Employee updated successfully"}
    

    @staticmethod
    def get_employee_by_manager(db,managerID : int):
        result = db.execute(employeeTable.select().where(employeeTable.c.manager_id == managerID)).mappings().all()
        return result
    
    @staticmethod
    def get_all_roles(db):
        result = db.execute(roles.select()).mappings().all()
        return result
    

    @staticmethod
    def get_highest_emp_code(db):
        result = db.execute(
            select(employeeTable.c.emp_code).order_by(employeeTable.c.emp_id.desc())
        ).first()
        if result:
            return result[0]
        return None

    @staticmethod
    def change_stats(db, payload : UpdateEmployeeStatus):
        update_data = {
            "emp_id": payload.emp_id,
            "status": payload.status,
        }
        query = employeeTable.update().where(employeeTable.c.emp_id == payload.emp_id).values(**update_data)
        db.execute(query)
        db.commit() 
        return {"success": True, "message": "Employee status updates"}
    
    @staticmethod
    def delete_employee(db,emp_id: int):
        stmt = delete(employeeTable).where(employeeTable.c.emp_id == emp_id)
        db.execute(stmt)
        db.commit()
        return {"message": "Employee deleted successfully"}
    
    @staticmethod
    def delete_employee_education(db,emp_id: int):
        db.execute(
            delete(employeeAddressTable).where(employeeAddressTable.c.emp_id == emp_id)
        )
        return {"message": "Employee education deleted successfully"}
    
    @staticmethod
    def delete_employee_address(db,emp_id: int):
        db.execute(
            delete(employeeAddressTable).where(employeeAddressTable.c.emp_id == emp_id)
        )
        return {"message": "Employee address deleted successfully"}

