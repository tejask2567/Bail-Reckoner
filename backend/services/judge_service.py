from typing import Optional
from uuid import UUID
from schemas.judge_schema import JudgeAuth
from models.judge_model import Judge
from core.security import get_password, verify_password
import pymongo

from schemas.judge_schema import JudgeUpdate


class JudgeService:
    @staticmethod
    async def create_judge(judge: JudgeAuth):
        judge_in = Judge(
            barid=judge.barid,
            judgeid=judge.judgeid,
            email=judge.email,
            hashed_password=get_password(judge.password),
            first_name=judge.first_name,
            last_name=judge.last_name
        )
        await judge_in.save()
        return judge_in
    
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[Judge]:
        judge = await JudgeService.get_judge_by_email(email=email)
        if not judge:
            return None
        if not verify_password(password=password, hashed_pass=judge.hashed_password):
            return None
        
        return judge
    
    @staticmethod
    async def get_judge_by_email(email: str) -> Optional[Judge]:
        judge = await Judge.find_one(Judge.email == email)
        return judge
    
    @staticmethod
    async def get_judge_by_id(id: UUID) -> Optional[Judge]:
        judge = await Judge.find_one(Judge.user_id == id)
        return judge
    
    @staticmethod
    async def update_judge(id: UUID, data: JudgeUpdate) -> Judge:
        judge = await Judge.find_one(Judge.user_id == id)
        if not judge:
            raise pymongo.errors.OperationFailure("judge not found")
    
        await judge.update({"$set": data.dict(exclude_unset=True)})
        return judge