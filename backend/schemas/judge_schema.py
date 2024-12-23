from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class JudgeAuth(BaseModel):
    email: EmailStr
    barid: str
    judgeid: str
    password: str
    first_name: str
    last_name: str

class JudgeOut(BaseModel):
    user_id: UUID
    barid: str
    judgeid:str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    disabled: Optional[bool] = False
    

class JudgeUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None