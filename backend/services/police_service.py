from typing import Optional
from uuid import UUID
from schemas.police_schema import PoliceAuth
from models.police_model import Police
from core.security import get_password, verify_password
import pymongo

from schemas.police_schema import PoliceUpdate


class PoliceService:
    @staticmethod
    async def create_police(user: PoliceAuth):
        user_in = Police(
            policeid=user.policeid,
            email=user.email,
            hashed_password=get_password(user.password),
            first_name=user.first_name,
            last_name=user.last_name
        )
        await user_in.save()
        return user_in
    
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[Police]:
        user = await PoliceService.get_police_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_pass=user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    async def get_police_by_email(email: str) -> Optional[Police]:
        user = await Police.find_one(Police.email == email)
        return user
    
    @staticmethod
    async def get_police_by_id(id: UUID) -> Optional[Police]:
        user = await Police.find_one(Police.user_id == id)
        return user
    
    @staticmethod
    async def update_user(id: UUID, data: PoliceUpdate) -> Police:
        user = await Police.find_one(Police.user_id == id)
        if not user:
            raise pymongo.errors.OperationFailure("Police not found")
    
        await user.update({"$set": data.dict(exclude_unset=True)})
        return user