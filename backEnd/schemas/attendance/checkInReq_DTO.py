from pydantic import BaseModel

class CheckIn(BaseModel):
    emp_id: int
    manager_id: int
    ip_address: str