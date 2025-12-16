from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
import json

from app.database import get_db
from app.models import User, Review
from app.schemas import UserResponse, WorkerSearchFilters, ReviewResponse

router = APIRouter(prefix="/workers", tags=["Workers"])


@router.get("/search", response_model=List[UserResponse])
def search_workers(
    skill: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    min_rate: Optional[float] = Query(None),
    max_rate: Optional[float] = Query(None),
    min_rating: Optional[float] = Query(None),
    is_available: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Search and filter workers based on various criteria
    """
    query = db.query(User).filter(User.role == "worker")
    
    # Filter by skill (search in JSON array)
    if skill:
        query = query.filter(User.skills.like(f'%{skill}%'))
    
    # Filter by location
    if location:
        query = query.filter(User.location.like(f'%{location}%'))
    
    # Filter by hourly rate range
    if min_rate is not None:
        query = query.filter(User.hourly_rate >= min_rate)
    if max_rate is not None:
        query = query.filter(User.hourly_rate <= max_rate)
    
    # Filter by minimum rating
    if min_rating is not None:
        query = query.filter(User.rating >= min_rating)
    
    # Filter by availability
    if is_available is not None:
        query = query.filter(User.is_available == is_available)
    
    workers = query.all()
    return workers


@router.get("/{worker_id}", response_model=UserResponse)
def get_worker_profile(worker_id: int, db: Session = Depends(get_db)):
    """
    Get detailed worker profile by ID
    """
    worker = db.query(User).filter(
        User.id == worker_id,
        User.role == "worker"
    ).first()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    return worker


@router.get("/{worker_id}/reviews", response_model=List[ReviewResponse])
def get_worker_reviews(worker_id: int, db: Session = Depends(get_db)):
    """
    Get all reviews for a specific worker
    """
    worker = db.query(User).filter(
        User.id == worker_id,
        User.role == "worker"
    ).first()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    reviews = db.query(Review).filter(Review.worker_id == worker_id).all()
    return reviews


@router.get("/categories/all")
def get_skill_categories():
    """
    Get predefined skill categories
    """
    categories = [
        "Mason",
        "Electrician",
        "Plumber",
        "Carpenter",
        "Painter",
        "Cleaner",
        "Sanitation Worker",
        "Gardener",
        "Security Guard",
        "Cook/Chef",
        "Driver",
        "Construction Worker",
        "Welder",
        "HVAC Technician",
        "Other"
    ]
    return {"categories": categories}
