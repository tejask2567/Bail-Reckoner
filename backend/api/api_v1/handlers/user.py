from fastapi import APIRouter,HTTPException, status,Form
from schemas.user_schema import UserAuth,UserOut,UserUpdate
from fastapi import Depends
from services.user_service import UserService
from api.deps.user_deps import get_current_user
from models.user_model import User
user_router = APIRouter()
import pymongo
@user_router.post('/create', summary="Create new user", response_model=User)
async def create_user(
    email: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...)
):
    try:
        # Convert the input data into a `UserAuth` object
        user_auth = UserAuth(
            email=email,
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        # Pass the `UserAuth` object to the service
        return await UserService.create_user(user_auth)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )

@user_router.get('/me', summary='Get details of currently logged in user', response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return user


@user_router.post('/update', summary='Update User', response_model=UserOut)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )