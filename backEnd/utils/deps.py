from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from repository.index import employeeRepos
from config.jwt_config import SECRET_KEY

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = employeeRepos.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def role_checker(allowed_roles: list):
    def role_dependency(current_user = Depends(get_current_user)):
        if current_user.role.role_name not in allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return current_user
    return role_dependency
