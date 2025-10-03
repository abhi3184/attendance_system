from pydantic import BaseModel

class AddEmployeeReq(BaseModel):
    emp_code:str
    firstName: str
    lasteName: str
    emailId:str
    mobile: str
    department: str
    shift:str
    password: str
    roles: int
