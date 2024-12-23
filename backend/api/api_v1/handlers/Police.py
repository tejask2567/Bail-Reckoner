from fastapi import APIRouter,HTTPException, status
from schemas.police_schema import PoliceAuth,PoliceOut,PoliceUpdate
from fastapi import Depends
from services.police_service import PoliceService
from api.deps.police_deps import get_current_police
from models.police_model import Police
police_router = APIRouter()
import pymongo
@police_router.post('/create', summary="Create new police", response_model=PoliceOut)
async def create_user(data: PoliceAuth):
    try:
        return await PoliceService.create_police(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="police with this email or username already exist"
        )

@police_router.get('/me', summary='Get details of currently logged in police', response_model=PoliceOut)
async def get_me(user: Police = Depends(get_current_police)):
    return user


@police_router.post('/update', summary='Update User', response_model=PoliceOut)
async def update_user(data: PoliceUpdate, user: Police = Depends(get_current_police)):
    try:
        return await PoliceService.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="police does not exist"
        )