
from models.index import employeeTable
from schemas.index import Employee

class loginRepo:
    @staticmethod
    def user_login(db,req):
        result = db.execute(
            employeeTable.select().where(
                (employeeTable.c.emailId == req.login) 
            )
        ).mappings().first()
        return result