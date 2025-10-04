from pydantic import BaseModel


class GetManagerRes(BaseModel):
    emp_id:int
    firstName: str
    lastName: str