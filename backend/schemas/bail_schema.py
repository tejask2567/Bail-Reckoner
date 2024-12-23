from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BailCreate(BaseModel):
    case_id: str
    petitioner_name: str
    petitioner_address: str
    respondent_name: str
    respondent_address: str
    police_station_name: str
    police_station_address: str
    bail_type: str
    bail_subject: str
    bail_document: str
    fir_detail: Optional[str] = None
    Lawyer_email:Optional[str]=None
    
class BailUpdate(BaseModel):
    status: Optional[str] = None
    bail_document: Optional[str] = None
    fir_detail: Optional[str] = None