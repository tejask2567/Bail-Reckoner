from typing import List,Optional,Tuple,Dict,Any
from models.bail_model import Bail
from models.lawyer_model import Lawyer
from schemas.bail_schema import BailCreate, BailUpdate
from datetime import datetime
class BailService:
    @staticmethod
    async def list_bails(
        skip: int = 0,
        limit: int = 30
    ) -> Tuple[List[dict], int]:
        # Base query
        base_query = Bail.find()
        
        # Get total count
        total = await base_query.count()
        
        # Get raw documents from MongoDB
        bails = await base_query.skip(skip).limit(limit).to_list()
        
        # Convert documents to dictionaries with proper handling of missing fields
        formatted_bails = []
        for bail in bails:
            try:
                # Convert to raw dict first
                bail_dict = {
                    "bail_id": str(bail.bail_id),
                    "case_id": bail.case_id,
                    "assigned_lawyer": str(bail.assigned_lawyer.id) if bail.assigned_lawyer else None,
                    "plaintiff": bail.plaintiff,
                    "plaintiff_address": bail.plaintiff_address,
                    "plaintiff_age": getattr(bail, 'plaintiff_age', ''),  # Use getattr for potentially missing fields
                    "plaintiff_sex": getattr(bail, 'plaintiff_sex', ''),
                    "nationality": bail.nationality,
                    "occupation": bail.occupation,
                    "defendant_name": bail.defendant_name,
                    "defendant_address": bail.defendant_address,
                    "police_station_name": bail.police_station_name,
                    "police_station_address": bail.police_station_address,
                    "bail_type": bail.bail_type,
                    "bail_subject": bail.bail_subject,
                    "bail_document": bail.bail_document,
                    "offence_type": getattr(bail, 'offence_type', ''),
                    "status": bail.status,
                    "_id": str(bail.id) if hasattr(bail, 'id') else None
                }

                # Handle datetime fields
                if hasattr(bail, 'current_datetime') and bail.current_datetime:
                    bail_dict['current_datetime'] = bail.current_datetime.isoformat()
                
                if hasattr(bail, 'fir_date') and bail.fir_date:
                    bail_dict['fir_date'] = bail.fir_date.isoformat()
                
                if hasattr(bail, 'date_of_application') and bail.date_of_application:
                    bail_dict['date_of_application'] = bail.date_of_application.isoformat()

                # Handle optional fields
                optional_fields = [
                    'fir_ID', 'fir_document', 'Lawyer_email',
                    'interm_bail', 'list_of_affidivit'
                ]
                
                for field in optional_fields:
                    if hasattr(bail, field):
                        bail_dict[field] = getattr(bail, field)
                
                formatted_bails.append(bail_dict)
            except Exception as e:
                print(f"Error processing bail document: {e}")
                continue
        
        return formatted_bails, total

    @staticmethod
    def format_single_bail(bail: Bail) -> Dict[str, Any]:
        """Helper method to format a single bail response"""
        try:
            return {
                "bail_id": str(bail.bail_id),
                "case_id": bail.case_id,
                "assigned_lawyer": str(bail.assigned_lawyer.id) if bail.assigned_lawyer else None,
                "plaintiff": bail.plaintiff,
                "plaintiff_address": bail.plaintiff_address,
                "plaintiff_age": getattr(bail, 'plaintiff_age', ''),
                "plaintiff_sex": getattr(bail, 'plaintiff_sex', ''),
                "nationality": bail.nationality,
                "occupation": bail.occupation,
                "defendant_name": bail.defendant_name,
                "defendant_address": bail.defendant_address,
                "police_station_name": bail.police_station_name,
                "police_station_address": bail.police_station_address,
                "bail_type": bail.bail_type,
                "bail_subject": bail.bail_subject,
                "bail_document": bail.bail_document,
                "offence_type": getattr(bail, 'offence_type', ''),
                "current_datetime": bail.current_datetime.isoformat() if bail.current_datetime else None,
                "fir_date": bail.fir_date.isoformat() if bail.fir_date else None,
                "date_of_application": bail.date_of_application.isoformat() if bail.date_of_application else None,
                "status": bail.status,
                "_id": str(bail.id) if hasattr(bail, 'id') else None,
                # Optional fields
                "fir_ID": getattr(bail, 'fir_ID', None),
                "fir_document": getattr(bail, 'fir_document', None),
                "Lawyer_email": getattr(bail, 'Lawyer_email', None),
                "interm_bail": getattr(bail, 'interm_bail', None),
                "list_of_affidivit": getattr(bail, 'list_of_affidivit', None)
            }
        except Exception as e:
            print(f"Error formatting bail document: {e}")
            raise

    @staticmethod
    async def create_bail(lawyer: str, data: BailCreate) -> Bail:
        print(lawyer)
        bail = Bail(
            **data.dict(),
            assigned_lawyer=lawyer
        )
        return await bail.insert()

    @staticmethod
    async def search_bails(
        search: str,
        skip: int = 0,
        limit: int = 30
    ) -> Tuple[List[Bail], int]:
        query = {
            "$or": [
                {"bail_id": {"$regex": search, "$options": "i"}},
                {"case_id": {"$regex": search, "$options": "i"}}
            ]
        }
        
        # Create base query
        base_query = Bail.find(query)
        
        # Get total count
        total = await base_query.count()
        
        # Get paginated results
        bails = await base_query.skip(skip).limit(limit).to_list()
        
        return bails, total
    
    @staticmethod
    async def search_lawyer_bails(
        id: str,
        skip: int = 0,
        limit: int = 30
    ) -> Tuple[List[Bail], int]:
        
        
        # Create base query
        base_query = Bail.find()
        
        # Get total count
        total = await base_query.count()
        # Get paginated results
        bails = await base_query.skip(skip).limit(limit).to_list()

        return bails, total
    @staticmethod
    async def retrieve_bail(bail_id: str):
        bail = await Bail.find_one(Bail.bail_id == bail_id)
        return bail

    @staticmethod
    async def update_bail(bail_id: str, data: BailUpdate, ):
        bail = await BailService.retrieve_bail(bail_id)
        if bail:
            await bail.update({"$set": data.dict(exclude_unset=True)})
            await bail.save()
        return bail

    @staticmethod
    async def delete_bail(bail_id: str, lawyer: Optional[Lawyer] = None) -> None:
        bail = await BailService.retrieve_bail(bail_id, lawyer)
        if bail:
            await bail.delete()
        return None