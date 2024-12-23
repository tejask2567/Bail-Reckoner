from fastapi import APIRouter,HTTPException, status,Form
from schemas.lawyer_schema import LawyerAuth,LawyerOut,LawyerUpdate
from fastapi import Depends
from services.lawyer_service import LawyerService
from api.deps.lawyer_deps import get_current_lawyer
from models.lawyer_model import Lawyer
from typing import List
Lawyer_router = APIRouter()
import pymongo
from pydantic import BaseModel
from datetime import datetime
from models.bail_model import Bail
from reccom import query_legal_case
class BailCaseResponse(BaseModel):
    bail_id: str
    case_id: str
    petitioner_name: str
    bail_type: str
    bail_subject: str
    date_of_application: datetime
    status: str

@Lawyer_router.post('/create', summary="Create new Lawyer", response_model=LawyerOut)
async def create_lawyer(
    email: str = Form(...),
    barname: str = Form(...),
    barid: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...)
):
    try:
        # Convert form data to LawyerAuth object
        lawyer_auth = LawyerAuth(
            email=email,
            barname=barname,
            barid=barid,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        # Pass the object to the service
        return await LawyerService.create_Lawyer(lawyer_auth)
    except Exception:  # Replace with a specific exception like pymongo.errors.DuplicateKeyError
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lawyer with this email or barid already exists"
        )

@Lawyer_router.get('/me', summary='Get details of currently logged in lawyer', response_model=Lawyer)
async def get_me(lawyer: Lawyer = Depends(get_current_lawyer)):
    print(lawyer)
    return lawyer


@Lawyer_router.post('/update', summary='Update lawyer', response_model=LawyerOut)
async def update_lawyer(data: LawyerUpdate, lawyer: Lawyer = Depends(get_current_lawyer)):
    try:
        return await LawyerService.update_lawyer(lawyer.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lawyer does not exist"
        )
        
@Lawyer_router.get("/lawyer/{lawyer_id}/", response_model=List[BailCaseResponse])
async def get_lawyer_cases(lawyer_id: str,lawyer: Lawyer = Depends(get_current_lawyer)):
    try:
        # Query the database for all bail cases assigned to the lawyer
        cases = await Bail.find(
            Bail.assigned_lawyer_email== lawyer
        ).sort(
            -Bail.date_of_application  # Sort by newest first
        ).to_list()
        print("caes",cases)
        if not cases:
            return []
        
        # Transform the data to match the response model
        response_cases = [
            BailCaseResponse(
                bail_id=case.bail_id,
                case_id=case.case_id,
                petitioner_name=case.petitioner_name,
                bail_type=case.bail_type,
                bail_subject=case.bail_subject,
                date_of_application=case.date_of_application,
                status=case.status
            ) for case in cases
        ]
        
        return response_cases
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching cases: {str(e)}"
        )

@Lawyer_router.post("/lawyer/past/")
async def get_lawyer_cases(query: str = Form(...)):
    try:
        # Mocked function to simulate querying legal cases
        res = query_legal_case(query)  # Replace with your actual logic
        print(res)
        return {"similar_cases": res['similar_cases']}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching cases: {str(e)}"
            )