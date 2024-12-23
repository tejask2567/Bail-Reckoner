from datetime import datetime
from typing import List, Optional
from uuid import UUID
from beanie import PydanticObjectId
from models.chargesheet_model import ChargeSheet, ChargeSheetCreate, ChargeSheetUpdate

class ChargeSheetService:
    @staticmethod
    async def create_charge_sheet(data: ChargeSheetCreate) -> ChargeSheet:
        charge_sheet = ChargeSheet(
            **data.model_dump(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        await charge_sheet.insert()
        return charge_sheet

    @staticmethod
    async def get_charge_sheet(charge_sheet_id: UUID) -> Optional[ChargeSheet]:
        return await ChargeSheet.find_one(ChargeSheet.charge_sheet_id == charge_sheet_id)

    @staticmethod
    async def get_charge_sheets(skip: int = 0, limit: int = 100) -> List[ChargeSheet]:
        return await ChargeSheet.find_all().skip(skip).limit(limit).to_list()

    @staticmethod
    async def update_charge_sheet(
        charge_sheet_id: UUID,
        data: ChargeSheetUpdate
    ) -> Optional[ChargeSheet]:
        charge_sheet = await ChargeSheetService.get_charge_sheet(charge_sheet_id)
        if not charge_sheet:
            return None

        update_data = data.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await charge_sheet.update({"$set": update_data})

        return charge_sheet

    @staticmethod
    async def delete_charge_sheet(charge_sheet_id: UUID) -> bool:
        charge_sheet = await ChargeSheetService.get_charge_sheet(charge_sheet_id)
        if not charge_sheet:
            return False
        
        await charge_sheet.delete()
        return True

    @staticmethod
    async def search_by_case_id(case_id: str) -> List[ChargeSheet]:
        return await ChargeSheet.find(ChargeSheet.case_id == case_id).to_list()