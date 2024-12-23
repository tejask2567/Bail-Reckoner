from beanie import Document, Link
from pydantic import Field
from typing import Optional
from datetime import datetime
import uuid
from models.lawyer_model import Lawyer

class Bail(Document):
    bail_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    case_id: str
    assigned_lawyer: Link[Lawyer]
    plaintiff: str
    plaintiff_address: str
    plaintiff_age: str
    plaintiff_sex: str
    nationality: Optional[str] = None
    occupation: Optional[str] = None
    defendant_name: str
    defendant_address: str
    police_station_name: str
    police_station_address: str
    bail_type: str  # "Anticipatory" or "Regular"
    bail_subject: str
    bail_document: str
    date_of_application: datetime = Field(default_factory=datetime.now)
    current_datetime: datetime = Field(None)
    fir_ID: Optional[str] = None
    fir_date: Optional[datetime] = Field(None)
    Lawyer_email: Optional[str] = None
    status: str = Field(default="Pending")
    offence_type: str
    interm_bail: Optional[str] = None
    list_of_affidivit: Optional[str] = None
    fir_document: Optional[str] = None

    class Settings:
        name = "bails"