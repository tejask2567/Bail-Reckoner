from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class PoliceAuth(BaseModel):
    email: EmailStr = Field(..., description="police email")
    policeid: str = Field(..., min_length=5, max_length=50, description="police id")
    password: str = Field(..., min_length=5, max_length=24, description="police password")
    first_name: Optional[str]
    last_name: Optional[str]

class PoliceOut(BaseModel):
    user_id: UUID
    policeid: str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    disabled: Optional[bool] = False
    

class PoliceUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None