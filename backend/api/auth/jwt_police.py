from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from services.police_service import PoliceService
from core.security import create_access_token, create_refresh_token
from schemas.auth_schema import TokenSchema
from schemas.police_schema import PoliceOut
from models.police_model import Police
from api.deps.police_deps import get_current_police
from core.config import settings
from schemas.auth_schema import TokenPayload
from pydantic import ValidationError
from jose import jwt


police_auth_router = APIRouter()


@police_auth_router.post('/login', summary="Create access and refresh tokens for police", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await PoliceService.authenticate(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": create_access_token(user.user_id),
        "refresh_token": create_refresh_token(user.user_id),
    }


@police_auth_router.post('/test-token', summary="Test if the access token is valid", response_model=PoliceOut)
async def test_token(user: Police = Depends(get_current_police)):
    return user


@police_auth_router.post('/refresh', summary="Refresh token", response_model=TokenSchema)
async def refresh_token(refresh_token: str = Body(...)):
    try:
        payload = jwt.decode(
            refresh_token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await PoliceService.get_police_by_id(token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for user",
        )
    return {
        "access_token": create_access_token(user.user_id),
        "refresh_token": create_refresh_token(user.user_id),
    }