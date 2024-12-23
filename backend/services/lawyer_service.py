from typing import Optional
from uuid import UUID
from schemas.lawyer_schema import LawyerAuth
from models.lawyer_model import Lawyer
from core.security import get_password, verify_password
import pymongo

from schemas.user_schema import UserUpdate


class LawyerService:
    @staticmethod
    async def create_Lawyer(lawyer: LawyerAuth):
        lawyer_in = Lawyer(
            barid=lawyer.barid,
            barname=lawyer.barname,
            email=lawyer.email,
            hashed_password=get_password(lawyer.password),
            first_name=lawyer.first_name,
            last_name=lawyer.last_name
        )
        await lawyer_in.save()
        return lawyer_in
    
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[Lawyer]:
        lawyer = await LawyerService.get_lawyer_by_email(email=email)
        if not lawyer:
            return None
        if not verify_password(password=password, hashed_pass=lawyer.hashed_password):
            return None
        
        return lawyer
    
    @staticmethod
    async def get_lawyer_by_email(email: str) -> Optional[Lawyer]:
        lawyer = await Lawyer.find_one(Lawyer.email == email)
        return lawyer
    
    @staticmethod
    async def get_lawyer_by_id(id: UUID) -> Optional[Lawyer]:
        lawyer = await Lawyer.find_one(Lawyer.user_id == id)
        return lawyer
    
    @staticmethod
    async def update_lawyer(id: UUID, data: UserUpdate) -> Lawyer:
        lawyer = await Lawyer.find_one(Lawyer.user_id == id)
        if not lawyer:
            raise pymongo.errors.OperationFailure("Lawyer not found")
    
        await lawyer.update({"$set": data.dict(exclude_unset=True)})
        return lawyer