from fastapi import APIRouter
from api.api_v1.handlers import user
from api.api_v1.handlers import Lawyer
from api.api_v1.handlers import Judge
from api.api_v1.handlers import Police

from api.auth.jwt import user_auth_router
from api.auth.jwt_lawyer import lawyer_auth_router
from api.auth.jwt_judge import judge_auth_router
from api.auth.jwt_police import police_auth_router

from api.api_v1.handlers.bail import bail_router
from api.api_v1.handlers.chargesheet import charge_sheet
router = APIRouter()
#CRUD
router.include_router(user.user_router, prefix='/users', tags=["users"])
router.include_router(Lawyer.Lawyer_router, prefix='/lawyer', tags=["lawyer"])
router.include_router(Judge.judge_router, prefix='/judge', tags=["judge"])
router.include_router(Police.police_router, prefix='/police', tags=["police"])

#auths
router.include_router(lawyer_auth_router, prefix='/lawyer_auth', tags=["lawyer_auth"])
router.include_router(user_auth_router, prefix='/user_auth', tags=["user_auth"])
router.include_router(judge_auth_router, prefix='/judge_auth', tags=["judge_auth"])
router.include_router(police_auth_router, prefix='/police_auth', tags=["police_auth"])

#bail
router.include_router(bail_router, prefix="/bail", tags=["bail"])

router.include_router(charge_sheet, prefix="/charge_sheet", tags=["charge_sheet"])
# Miscellaneous