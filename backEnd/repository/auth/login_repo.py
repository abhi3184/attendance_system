
from models.index import employeeTable

class loginRepo:

    @staticmethod
    def user_exist_by_email(db,email):
        result = db.execute(employeeTable.select().where(employeeTable.c.emailId == email)).mappings().first()
        return result

    @staticmethod
    def user_login(db,req):
        result = db.execute(
            employeeTable.select().where(
                (employeeTable.c.emailId == req.login) 
            )
        ).mappings().first()
        return result