from fastapi import APIRouter,HTTPException, status,Form
from schemas.judge_schema import JudgeAuth,JudgeOut,JudgeUpdate
from fastapi import Depends
from services.judge_service import JudgeService
from api.deps.judge_deps import get_current_judge
from models.user_model import User
judge_router = APIRouter()
import pymongo

@judge_router.post('/create', summary="Create new Judge", response_model=JudgeOut)
async def create_judge(
    email: str = Form(...),
    barid: str = Form(...),
    judgeid: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...)
):
    try:
        judge_auth = JudgeAuth(
            email=email,
            barid=barid,
            judgeid=judgeid,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        # Pass the object to the service
        return await JudgeService.create_judge(judge_auth)
    except Exception:  # Replace with a specific exception like pymongo.errors.DuplicateKeyError
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Judge with this email or barid already exists"
        )

@judge_router.get('/me', summary='Get details of currently logged in judge', response_model=JudgeOut)
async def get_me(user: User = Depends(get_current_judge)):
    return user


@judge_router.post('/update', summary='Update judge', response_model=JudgeOut)
async def update_user(data: JudgeUpdate, user: User = Depends(get_current_judge)):
    try:
        return await JudgeService.update_judge(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="judge does not exist"
        )