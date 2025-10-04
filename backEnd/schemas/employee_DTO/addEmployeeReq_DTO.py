from pydantic import BaseModel, EmailStr

class AddEmployeeReq(BaseModel):
      # Employee fields
    firstName: str
    lastName: str
    emailId: EmailStr
    mobile: str
    department: str
    shift: str
    password: str
    roles: int
    manager_id: int

    # Education fields
    schoolName: str
    university: str
    degree: str
    fieldOfStudy: str
    passingyear: str
    location: str

    # Address fields
    address: str
    city: str
    state: str
    zip: str
    phoneAlt: str
class AddEmployeeEducationReq(BaseModel):
    emp_id:str
    school_name: str
    degree: str
    passing_year:str
    field_of_study : str
    university: str
    year:str
    location: str

class EmployeeExistReq(BaseModel):
    emailId: EmailStr
    mobile : str