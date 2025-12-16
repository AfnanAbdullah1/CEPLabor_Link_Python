from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models import Profile
from app.schemas import ProfileUpdate

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        return {"message": "Profile not created yet"}
    return profile


@router.post("/{user_id}/update")
def update_profile(user_id: int, data: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)

    if data.skills:
        profile.skills = json.dumps(data.skills)



    if data.experience:
        profile.experience = data.experience

    db.commit()
    return {"message": "Profile updated successfully"}
