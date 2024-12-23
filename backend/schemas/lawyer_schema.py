from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class LawyerAuth(BaseModel):
    email: EmailStr
    barname: str
    barid: str
    password: str
    first_name: str
    last_name: str

class LawyerOut(BaseModel):
    user_id: UUID
    barname: str
    barid:str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    disabled: Optional[bool] = False
    

class LawyerUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None