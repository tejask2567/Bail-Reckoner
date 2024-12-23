from datetime import datetime
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import BaseModel, Field
from uuid import UUID, uuid4

class ChargeSheet(Document):
    charge_sheet_id: UUID = Field(default_factory=uuid4)
    case_id: Indexed(str)
    date_of_arrest: datetime
    evidence_facts_collected: str
    witness_statement: str
    previous_criminal_record: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "charge_sheets"
        use_state_management = True
class ChargeSheetCreate(BaseModel):
    case_id: str
    date_of_arrest: datetime
    evidence_facts_collected: str
    witness_statement: str
    previous_criminal_record: str

class ChargeSheetUpdate(BaseModel):
    case_id: Optional[str] = None
    date_of_arrest: Optional[datetime] = None
    evidence_facts_collected: Optional[str] = None
    witness_statement: Optional[str] = None
    previous_criminal_record: Optional[str] = None