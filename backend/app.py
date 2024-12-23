from fastapi import FastAPI
from core.config import settings
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from models.user_model import User
from models.judge_model import Judge
from models.lawyer_model import Lawyer
from models.police_model import Police
from models.bail_model import Bail
from api.api_v1.router import router
from models.chargesheet_model import ChargeSheet
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def app_init():
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).BAIL_RECKONER
    
    await init_beanie(
        database=db_client,
        document_models= [
            User,
            Judge,
            Lawyer,
            Police,
            Bail,
            ChargeSheet
        ]
    )
    
app.include_router(router, prefix=settings.API_V1_STR)