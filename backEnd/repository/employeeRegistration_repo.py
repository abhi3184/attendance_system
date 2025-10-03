
from models.index import employeeTable
from schemas.index import AddEmployeeReq
from sqlalchemy import or_
from sqlalchemy import select
from utils.HashPasswor import hash_password

class employeRegistrationRepository:

    @staticmethod
    def check_user_exist(db, employee: AddEmployeeReq):
        result = db.execute(
            employeeTable.select().where(
                or_(
                    employeeTable.c.emailId == employee.emailId,
                    employeeTable.c.mobile == employee.mobile
                )
            )
        ).mappings().first()

        if not result:
            return None
        conflicts = []
        if result['emailId'] == employee.emailId:
            conflicts.append("emailId")
        if result['mobile'] == employee.mobile:
            conflicts.append("mobile")
        return {"exists": True, "conflicts": conflicts}

    @staticmethod
    def get_highest_emp_code(db):
        stmt = (
            select(employeeTable.c.emp_code)
            .order_by(employeeTable.c.emp_code.desc())
            .limit(1)
        )
        latest = db.execute(stmt).first()
        return latest[0] if latest else None


    @staticmethod
    def post_user(db,employee: AddEmployeeReq):
        hashed_pw = hash_password(employee.password)

        result = db.execute(
            employeeTable.insert().values(
                emp_code = employee.emp_code,
                firstName = employee.firstName,
                lastName = employee.lasteName,
                emailId = employee.emailId,
                mobile = employee.mobile,
                department = employee.department,
                shift_time = employee.shift,
                password = hashed_pw,
                roles_id  = employee.roles               
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
            "message": "Employee registered successfully",
        }


