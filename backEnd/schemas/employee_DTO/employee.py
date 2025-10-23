from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# ---------- Employee Schemas ----------

class EmployeeBase(BaseModel):
    firstName: str
    lastName: str
    emailId: EmailStr
    mobile: str = Field(..., max_length=15)
    department: str
    shift: str
    roles: int
    manager_id: int

class AddEmployeeReq(EmployeeBase):
    schoolName: Optional[str]
    university: Optional[str]
    degree: Optional[str]
    passingyear: Optional[int]
    location: Optional[str]
    fieldOfStudy: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    phoneAlt: Optional[str]
    gender: Optional[str]
    dateOfBirth : Optional[str]
    dateOfJoining : Optional[str]
    salary : Optional[str]
class UpdateEmployeeRequest(BaseModel):
    emp_id: int
    firstName: str
    lastName: str
    department: str
    shift: str
    roles: int
    manager_id: int

class UpdateEmployeeStatus(BaseModel):
    emp_id: int
    status: str

class EmployeeExistReq(BaseModel):
    emailId: str
    mobile: str

# Response Schemas

class EmployeeResponse(BaseModel):
    emp_id: int
    emp_code: str
    firstName: str
    lastName: str
    emailId: EmailStr
    mobile: str
    department: str
    shift: str
    status: str
    role: str
    manager_id: int

class GetManagerRes(BaseModel):
    emp_id: int
    firstName: str
    lastName: str
    department: str

class EmployeeAddressReponse(BaseModel):
    id_address : int
    address : str
    address : str
    state : str
    zip_code : str
    contact : str
    emp_id : int

class EmployeeEducationResponse(BaseModel):
    education_id : int 
    school_name : str
    degree : str
    passing_year : str
    field_of_study : str
    university : str 
    location : str
    emp_id : int 