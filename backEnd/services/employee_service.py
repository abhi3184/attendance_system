
from models.index import employeeTable
from repository.index import employeeRepos
from sqlalchemy.orm import Session

class employeeService:
    
    @staticmethod
    def get_all_users(db: Session):
        result = employeeRepos.get_all_users(db)
        return result

    @staticmethod
    def get_user_by_id(db: Session, user_id):
        return employeeRepos.get_user_by_id(db, user_id)

    @staticmethod
    def check_user_exist_by_email(db: Session, email):
        return employeeRepos.get_user_by_email(db, email)

    @staticmethod
    def update_user(db: Session, user_id, payload):
        return employeeRepos.update_user(db, user_id, payload)

    @staticmethod
    def delete_user(db: Session, user_id):
        return employeeRepos.delete_user(db, user_id)
