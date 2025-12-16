from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.database import get_db
from app.models import User
from app.schemas import UserUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
def get_all_users(
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all users, optionally filtered by role
    """
    query = db.query(User)
    
    if role:
        if role not in ['worker', 'hirer']:
            raise HTTPException(status_code=400, detail="Invalid role")
        query = query.filter(User.role == role)
    
    return query.all()


@router.get("/workers", response_model=List[UserResponse])
def get_all_workers(db: Session = Depends(get_db)):
    """
    Get all workers (shorthand for filtering by role)
    """
    return db.query(User).filter(User.role == "worker").all()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get a specific user by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """
    Get user statistics
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    stats = {
        "user_id": user.id,
        "name": user.name,
        "role": user.role,
        "rating": user.rating,
        "total_jobs": user.total_jobs,
        "is_available": user.is_available,
        "member_since": user.created_at
    }
    
    return stats


@router.put("/{user_id}/update", response_model=UserResponse)
def update_user_profile(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    """
    Update user profile information
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update basic fields
    if data.name is not None:
        user.name = data.name
    
    if data.phone is not None:
        user.phone = data.phone
    
    if data.location is not None:
        user.location = data.location
    
    if data.experience is not None:
        user.experience = data.experience
    
    if data.profile_image is not None:
        user.profile_image = data.profile_image
    
    # Update worker-specific fields
    if data.skills is not None:
        user.skills = json.dumps(data.skills)
    
    if data.hourly_rate is not None:
        user.hourly_rate = data.hourly_rate
    
    if data.is_available is not None:
        user.is_available = data.is_available

    db.commit()
    db.refresh(user)
    
    return user

