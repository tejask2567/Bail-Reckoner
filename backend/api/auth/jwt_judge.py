from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from services.judge_service import JudgeService
from core.security import create_access_token, create_refresh_token
from schemas.auth_schema import TokenSchema
from schemas.judge_schema import JudgeOut
from models.judge_model import Judge
from api.deps.judge_deps import get_current_judge
from core.config import settings
from schemas.auth_schema import TokenPayload
from pydantic import ValidationError
from jose import jwt


judge_auth_router = APIRouter()


@judge_auth_router.post('/login', summary="Create access and refresh tokens for judge", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    judge = await JudgeService.authenticate(email=form_data.username, password=form_data.password)
    if not judge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": create_access_token(judge.user_id),
        "refresh_token": create_refresh_token(judge.user_id),
    }


@judge_auth_router.post('/test-token', summary="Test if the access token is valid", response_model=JudgeOut)
async def test_token(judge: Judge = Depends(get_current_judge)):
    return judge


@judge_auth_router.post('/refresh', summary="Refresh token", response_model=TokenSchema)
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
    judge = await JudgeService.get_judge_by_id(token_data.sub)
    if not judge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for judge",
        )
    return {
        "access_token": create_access_token(judge.user_id),
        "refresh_token": create_refresh_token(judge.user_id),
    }