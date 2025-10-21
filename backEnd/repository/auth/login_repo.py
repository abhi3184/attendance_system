# repositories/login_repo.py
from sqlalchemy.orm import Session
from models.employee import Employee
from utils.HashPasswor import hash_password

class LoginRepo:

    @staticmethod
    def user_exist_by_email(db: Session, email: str):
        return db.query(Employee).filter(Employee.emailId == email).first()

    @staticmethod
    def user_login(db: Session, login: str):
        return db.query(Employee).filter(Employee.emailId == login).first()

    @staticmethod
    def update_password(db: Session, email: str, password: str):
        user = db.query(Employee).filter(Employee.emailId == email).first()
        if not user:
            return {"success": False, "message": "User not found"}

        user.password = hash_password(password)
        db.commit()
        db.refresh(user)
        return {"success": True, "message": "Password updated successfully"}
