from pydantic import BaseModel, EmailStr
from typing import Optional

class AddressResponse(BaseModel):
    address:str
    city: str
    state: str
    zipCode: str
    contact: str

class EducationResponse(BaseModel):
    school_name: str
    degree: str
    passingYear:str
    fieldOfStudy: str
    university: str
    location: str

class EmployeeResponse(BaseModel):
    firstName: str
    lastName: str
    emailId: EmailStr
    mobile: str
    department: str
    shift: str
    status: str
