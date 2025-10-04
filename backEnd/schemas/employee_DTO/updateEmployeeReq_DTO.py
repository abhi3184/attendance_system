from pydantic import BaseModel, EmailStr


class UpdateEmployeeRequest(BaseModel):
    emp_id : int
    firstName : str
    lastName: str
    department : str
    shift : str
    roles : int
    manager_id: int

class UpdateEmployeeStatus(BaseModel):
    emp_id : int
    status : str