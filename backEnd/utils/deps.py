from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from repository.index import employeRegistrationRepository
from config.jwt_config import SECRET_KEY
from config.db import get_db
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
bearer_scheme = HTTPBearer()

def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
        db: Session = Depends(get_db)):
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        emp_id = payload.get("id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    employee = employeRegistrationRepository.validate_Employee(db,emp_id)
    if not employee:
        raise HTTPException(status_code=404, detail="User nahi")
    return employee

def role_checker(allowed_roles: list):
    def role_dependency(current_user = Depends(get_current_user)):
        print("current_user", current_user)
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=405, detail="Operation not permitted")
        return current_user
    return role_dependency
