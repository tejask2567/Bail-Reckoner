from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from services.lawyer_service import LawyerService
from core.security import create_access_token, create_refresh_token
from schemas.auth_schema import TokenSchema
from schemas.lawyer_schema import LawyerOut
from models.lawyer_model import Lawyer
from api.deps.lawyer_deps import get_current_lawyer
from core.config import settings
from schemas.auth_schema import TokenPayload
from pydantic import ValidationError
from jose import jwt


lawyer_auth_router = APIRouter()


@lawyer_auth_router.post('/login', summary="Create access and refresh tokens for lawyer", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    lawyer = await LawyerService.authenticate(email=form_data.username, password=form_data.password)
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": create_access_token(lawyer.user_id),
        "refresh_token": create_refresh_token(lawyer.user_id),
    }


@lawyer_auth_router.post('/test-token', summary="Test if the access token is valid", response_model=LawyerOut)
async def test_token(lawyer: Lawyer = Depends(get_current_lawyer)):
    return lawyer


@lawyer_auth_router.post('/refresh', summary="Refresh token", response_model=TokenSchema)
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
    lawyer = await LawyerService.get_lawyer_by_id(token_data.sub)
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for lawyer",
        )
    return {
        "access_token": create_access_token(lawyer.user_id),
        "refresh_token": create_refresh_token(lawyer.user_id),
    }