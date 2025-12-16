from fastapi import APIRouter

router = APIRouter(prefix="/services", tags=["Services"])

services_data = [
    "Cleaning",
    "Cooking",
    "Laundry",
    "Dishwashing",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Welder"
]

@router.get("/")
def get_services():
    return {"available_services": services_data}
