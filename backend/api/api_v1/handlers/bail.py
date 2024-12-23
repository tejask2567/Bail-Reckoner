from fastapi import APIRouter, Depends, HTTPException,Query,Form
from typing import List,Optional,Dict,Any
from models.lawyer_model import Lawyer
from models.bail_model import Bail
from schemas.bail_schema import BailCreate, BailUpdate
from services.bail_service import BailService
from api.deps.lawyer_deps import get_current_lawyer
from datetime import datetime
from pydantic import BaseModel
from models.lawyer_model import Lawyer
import math
class BailListResponse(BaseModel):
    items: List[Dict[str, Any]]
    total: int
    pages: int
    current_page: int
    size: int
class PaginatedResponse(BaseModel):
    items: List[Bail]
    total_items: int
    total_pages: int
    current_page: int
bail_router = APIRouter()

""" @bail_router.post("/", response_model=BailCreate)
async def create_bail(
    data: BailCreate,
    lawyer: Lawyer = Depends(get_current_lawyer)
):
    print(lawyer)
    if data.bail_type.lower() == "regular" and not data.fir_detail:
        raise HTTPException(
            status_code=400,
            detail="FIR details are mandatory for Regular bail applications"
        )
    return await BailService.create_bail(lawyer, data) """

@bail_router.post("/", response_model=Bail)
async def create_bail(
    bail_type: str = Form(...),
    case_id: str = Form(...),
    plaintiff: str = Form(...),
    plaintiff_address: str = Form(...),
    defendant_name: str = Form(...),
    defendant_address: str = Form(...),
    police_station_name: str = Form(...),
    police_station_address: str = Form(...),
    bail_subject: str = Form(...),
    bail_document: str = Form(...),
    lawyer: Lawyer = Depends(get_current_lawyer),
    Lawyer_email: str = Form(...),
    current_datetime: datetime = Form(...),
    fir_ID: Optional[str] = Form(None),
    fir_date: Optional[datetime] = Form(None),
    fir_document: Optional[str] = Form(None),
    nationality: str = Form(...),
    occupation: str = Form(...),
    interm_bail: str = Form(...),
    list_of_affidivit: str = Form(...),  # Fixed spelling
    plaintiff_age: str = Form(...),
    plaintiff_sex: str = Form(...),
    offence_type: str = Form(...),
):
    # Create bail application with base fields
    bail_data = {
        "bail_type": bail_type,
        "case_id": case_id,
        "plaintiff": plaintiff,
        "plaintiff_address": plaintiff_address,
        "defendant_name": defendant_name,
        "defendant_address": defendant_address,
        "police_station_name": police_station_name,
        "police_station_address": police_station_address,
        "bail_subject": bail_subject,
        "assigned_lawyer": lawyer,
        "Lawyer_email": Lawyer_email,
        "bail_document": bail_document,
        "current_datetime": current_datetime,
        "nationality": nationality,
        "occupation": occupation,
        "interm_bail": interm_bail,
        "list_of_affidivit": list_of_affidivit,  # Fixed spelling
        "plaintiff_age": plaintiff_age,
        "plaintiff_sex": plaintiff_sex,
        "offence_type": offence_type,
    }

    # Add FIR-related fields only if bail_type is Regular
    if bail_type == "Regular":
        if not all([fir_ID, fir_date, fir_document]):
            raise HTTPException(
                status_code=400,
                detail="FIR ID, date, and document are required for Regular bail type"
            )
        bail_data.update({
            "fir_ID": fir_ID,
            "fir_date": fir_date,
            "fir_document": fir_document
        })
    
    # Create and insert bail application
    bail_application = Bail(**bail_data)
    return await bail_application.insert()

async def format_bail_dict(bail: Bail) -> Dict[str, Any]:
    """Helper function to format a bail document into a dictionary"""
    return {
        "bail_id": str(bail.bail_id),
        "case_id": str(bail.case_id),
        "plaintiff": bail.plaintiff,
        "plaintiff_address": bail.plaintiff_address,
        "plaintiff_age": getattr(bail, 'plaintiff_age', ''),
        "plaintiff_sex": getattr(bail, 'plaintiff_sex', ''),
        "nationality": getattr(bail, 'nationality', ''),
        "occupation": getattr(bail, 'occupation', ''),
        "defendant_name": bail.defendant_name,
        "defendant_address": bail.defendant_address,
        "police_station_name": bail.police_station_name,
        "police_station_address": bail.police_station_address,
        "bail_type": bail.bail_type,
        "bail_subject": bail.bail_subject,
        "bail_document": bail.bail_document,
        "current_datetime": bail.current_datetime.isoformat() if bail.current_datetime else None,
        "date_of_application": bail.date_of_application.isoformat() if bail.date_of_application else None,
        "fir_ID": getattr(bail, 'fir_ID', None),
        "fir_date": bail.fir_date.isoformat() if getattr(bail, 'fir_date', None) else None,
        "Lawyer_email": getattr(bail, 'Lawyer_email', ''),
        "status": getattr(bail, 'status', 'Pending'),
        "offence_type": getattr(bail, 'offence_type', ''),
        "interm_bail": getattr(bail, 'interm_bail', ''),
        "list_of_affidivit": getattr(bail, 'list_of_affidivit', ''),
        "fir_document": getattr(bail, 'fir_document', None),
        "_id": str(bail.id) if hasattr(bail, 'id') else None,
    }

@bail_router.get("/", response_model=BailListResponse)
async def list_bails(
    page: int = Query(1, ge=1),
    size: int = Query(30, ge=1, le=100),
    search: Optional[str] = Query(None),

):
    try:
        # Calculate skip
        skip = (page - 1) * size

        # Base query
        base_query = {}

        # Add search functionality if search parameter is provided
        if search:
            search_query = {
                "$or": [
                    {"case_id": {"$regex": search, "$options": "i"}},
                    {"plaintiff": {"$regex": search, "$options": "i"}}
                ]
            }
            base_query.update(search_query)

        # Get total count
        total_documents = await Bail.find(base_query).count()
        total_pages = math.ceil(total_documents / size)

        # Get paginated results
        cursor = Bail.find(base_query).skip(skip).limit(size)
        bails = await cursor.to_list()
        print(bails)
        # Format the bail documents
        formatted_bails = []
        for bail in bails:
            try:
                formatted_bail = await format_bail_dict(bail)
                formatted_bails.append(formatted_bail)
            except Exception as e:
                print(f"Error formatting bail {bail.bail_id}: {str(e)}")
                continue

        return {
            "items": formatted_bails,
            "total": total_documents,
            "pages": total_pages,
            "current_page": page,
            "size": size
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch bail applications: {str(e)}"
        )


bail_router.get("/list", response_model=PaginatedResponse)
async def list_bails_lawyer(
    search: str = Query(default="", description="Search by Bail ID or Case ID"),
    page: int = Query(default=1, ge=1, description="Page number"),
    size: int = Query(default=30, ge=1, le=100, description="Number of items per page"),
    current_user: Lawyer = Depends(get_current_lawyer),
):
    try:
        # Filter bails based on search term
        filters = {}

        if search:
            filters.update({"$or": [
                {"bail_id": {"$regex": search, "$options": "i"}},
                {"case_id": {"$regex": search, "$options": "i"}},
            ]})

        total_items = await Bail.find(filters).count()

        # Pagination logic
        total_pages = (total_items + size - 1) // size
        bails = await Bail.find(filters).skip((page - 1) * size).limit(size).to_list()

        return {
            "items": bails,
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@bail_router.get("/{bail_id}", response_model=Bail)
async def get_bail(
    bail_id: str,
    #lawyer: Optional[Lawyer] = Depends(get_current_lawyer)
):
    bail = await BailService.retrieve_bail(bail_id)
    if not bail:
        raise HTTPException(status_code=404, detail="Bail application not found")
    return bail

@bail_router.put("/{bailId}")
async def update_bail(
    bailId: str,
    data: BailUpdate,
):
    bail = await BailService.update_bail(bailId, data)
    if not bail:
        raise HTTPException(status_code=404, detail="Bail application not found")
    return bail

@bail_router.delete("/{bail_id}")
async def delete_bail(
    bail_id: str,
    lawyer: Optional[Lawyer] = Depends(get_current_lawyer)
):
    await BailService.delete_bail(bail_id, lawyer)
    return {"message": "Bail application deleted successfully"}

@bail_router.get("/case/{case_id}")
async def get_bail(
    case_id: str,
    #lawyer: Optional[Lawyer] = Depends(get_current_lawyer)
):
    bail = await Bail.find_one(Bail.case_id == case_id)
    if not bail:
        raise HTTPException(status_code=404, detail="Bail application not found")
    return bail