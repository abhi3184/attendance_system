
from models.index import employeeTable
from schemas.index import Employee

class employeeRepos:
    @staticmethod
    def get_all_users(db):
        result = db.execute(employeeTable.select()).mappings().all()
        return result
    
    @staticmethod
    def get_user_by_id(db, emp_id):
        return db.execute(employeeTable.select().where(employeeTable.c.emp_id == emp_id)).mappings().first()
    
    @staticmethod
    def get_user_by_email(db, email):
        return  db.execute(employeeTable.select().where(employeeTable.c.emailId == email)).mappings().first()
      
    
    @staticmethod
    def update_user(db, user_id, payload):
        query = employeeTable.update().where(employeeTable.c.id == user_id).values(**payload.dict())
        db.execute(query)
        db.commit()
        return {"success": True}

    @staticmethod
    def delete_user(db, user_id):
        query = employeeTable.delete().where(employeeTable.c.id == user_id)
        db.execute(query)
        db.commit()
        return {"success": True}
