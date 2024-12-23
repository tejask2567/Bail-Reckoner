from fastapi import APIRouter, HTTPException, Query,Form
from typing import List,Optional,Union
from uuid import UUID
from models.chargesheet_model import ChargeSheet, ChargeSheetCreate, ChargeSheetUpdate
from services.ChargeSheetService import ChargeSheetService
from datetime import datetime
charge_sheet = APIRouter()
from pydantic import BaseModel
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from test2 import bail_judgement 
class ChargeSheetData(BaseModel):
    # Making fields optional and accepting multiple types where needed
    case_id: Optional[str] = None
    plaintiff: Optional[str] = None
    plaintiff_age: Optional[Union[int, str]] = None  # Accept both int and string
    plaintiff_sex: Optional[str] = None
    plaintiff_address: Optional[str] = None
    nationality: Optional[str] = None
    occupation: Optional[str] = None
    defendant_name: Optional[str] = None
    defendant_address: Optional[str] = None
    bail_type: Optional[str] = None
    offence_type: Optional[str] = None
    fir_ID: Optional[str] = None
    fir_date: Optional[Union[datetime, str]] = None  # Accept both datetime and string
    bail_subject: Optional[str] = None
    police_station_name: Optional[str] = None
    police_station_address: Optional[str] = None
    interm_bail: Optional[Union[bool, str]] = None  # Accept both boolean and string
    bail_document: Optional[str] = None
    list_of_affidivit: Optional[Union[List[str], str]] = None  # Accept both list and string

@charge_sheet.post("/charge-sheets/", response_model=ChargeSheet, status_code=201)
async def create_charge_sheet(case_id: str=Form(...),
                               date_of_arrest: datetime=Form(...),
                               evidence_facts_collected: str=Form(...),
                               witness_statement: str=Form(...),
                               previous_criminal_record: str=Form(...)


):
    charge_sheet={
        "case_id":case_id,
        'date_of_arrest':date_of_arrest,
        "evidence_facts_collected":evidence_facts_collected,
        "witness_statement":witness_statement,
        "previous_criminal_record":previous_criminal_record
    }
    charge_sheet_app = ChargeSheet(**charge_sheet,created_at=datetime.utcnow(),
            updated_at=datetime.utcnow())
    return await charge_sheet_app.insert()

@charge_sheet.get("/charge-sheets/{charge_sheet_id}", response_model=ChargeSheet)
async def get_charge_sheet(charge_sheet_id: UUID):
    charge_sheet = await ChargeSheetService.get_charge_sheet(charge_sheet_id)
    if not charge_sheet:
        raise HTTPException(status_code=404, detail="Charge sheet not found")
    return charge_sheet

@charge_sheet.get("/charge-sheets/", response_model=List[ChargeSheet])
async def get_charge_sheets(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100)
):
    return await ChargeSheetService.get_charge_sheets(skip, limit)

@charge_sheet.post("/charge-sheets/case/")
async def search_by_case_id(data: ChargeSheetData):
    res= await ChargeSheetService.search_by_case_id(data.case_id)
    date_of_arrest=(res[0].date_of_arrest)
    evidence_facts_collected=res[0].evidence_facts_collected
    witness_statement=res[0].witness_statement
    previous_criminal_record=res[0].previous_criminal_record
    return res
@charge_sheet.put("/charge-sheets/{charge_sheet_id}", response_model=ChargeSheet)
async def update_charge_sheet(charge_sheet_id: UUID, charge_sheet: ChargeSheetUpdate):
    updated_charge_sheet = await ChargeSheetService.update_charge_sheet(
        charge_sheet_id,
        charge_sheet
    )
    if not updated_charge_sheet:
        raise HTTPException(status_code=404, detail="Charge sheet not found")
    return updated_charge_sheet

@charge_sheet.delete("/charge-sheets/{charge_sheet_id}")
async def delete_charge_sheet(charge_sheet_id: UUID):
    deleted = await ChargeSheetService.delete_charge_sheet(charge_sheet_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Charge sheet not found")
    return {"message": "Charge sheet successfully deleted"}

@charge_sheet.post("/debug-charge-sheet")
async def debug_charge_sheet(data: ChargeSheetData):
    try:
        # Print all fields
        res= await ChargeSheetService.search_by_case_id(data.case_id)
        date_of_arrest=(res[0].date_of_arrest)
        evidence_facts_collected=res[0].evidence_facts_collected
        witness_statement=res[0].witness_statement
        previous_criminal_record=res[0].previous_criminal_record
        
        res=bail_judgement(offence_type=data.offence_type,
                           name=data.plaintiff,
                           age=data.plaintiff_age,
                           sex=data.plaintiff_sex,
                           nationality=data.nationality,
                           address=data.nationality,
                           occupation=data.occupation,
                           bail_type=data.bail_type,
                           fir_no=data.fir_ID,
                           fir_date=data.fir_date,
                           offence_charged=data.offence_type,
                           police_station_and_district=(data.police_station_name+data.police_station_address),
                           interim_bail=data.interm_bail,
                           arguments_for_bail_lawyer=data.bail_document,
                           list_of_affidivits_by_lawyer=data.list_of_affidivit,
                           date_of_Arrest=date_of_arrest,
                           evidences_facts_collected=evidence_facts_collected,
                           witness_statement=witness_statement,
                           previous_criminal_records=previous_criminal_record)
        return res

    except Exception as e:
        logger.error(f"Error processing charge sheet data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))