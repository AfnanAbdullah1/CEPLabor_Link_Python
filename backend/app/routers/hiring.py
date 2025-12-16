from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List

from app.database import get_db
from app.models import HiringRequest, User, Review
from app.schemas import (
    HiringRequestCreate, 
    HiringRequestUpdate, 
    HiringRequestResponse,
    ReviewCreate,
    ReviewResponse
)

router = APIRouter(prefix="/hiring", tags=["Hiring"])


@router.post("/requests", response_model=HiringRequestResponse)
def create_hiring_request(
    request_data: HiringRequestCreate,
    hirer_id: int,  # This should come from JWT token in production
    db: Session = Depends(get_db)
):
    """
    Create a new hiring request from hirer to worker
    """
    # Verify hirer exists and has hirer role
    hirer = db.query(User).filter(
        User.id == hirer_id,
        User.role == "hirer"
    ).first()
    if not hirer:
        raise HTTPException(status_code=404, detail="Hirer not found")
    
    # Verify worker exists and has worker role
    worker = db.query(User).filter(
        User.id == request_data.worker_id,
        User.role == "worker"
    ).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    # Create hiring request
    hiring_request = HiringRequest(
        hirer_id=hirer_id,
        worker_id=request_data.worker_id,
        job_title=request_data.job_title,
        job_description=request_data.job_description,
        job_location=request_data.job_location,
        estimated_hours=request_data.estimated_hours,
        offered_rate=request_data.offered_rate,
        status="pending"
    )
    
    db.add(hiring_request)
    db.commit()
    db.refresh(hiring_request)
    
    return hiring_request


@router.get("/requests/{request_id}", response_model=HiringRequestResponse)
def get_hiring_request(request_id: int, db: Session = Depends(get_db)):
    """
    Get a specific hiring request by ID
    """
    request = db.query(HiringRequest).filter(HiringRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Hiring request not found")
    
    return request


@router.get("/requests/hirer/{hirer_id}", response_model=List[HiringRequestResponse])
def get_hirer_requests(hirer_id: int, db: Session = Depends(get_db)):
    """
    Get all hiring requests made by a specific hirer
    """
    requests = db.query(HiringRequest).filter(
        HiringRequest.hirer_id == hirer_id
    ).order_by(HiringRequest.created_at.desc()).all()
    
    return requests


@router.get("/requests/worker/{worker_id}", response_model=List[HiringRequestResponse])
def get_worker_requests(worker_id: int, db: Session = Depends(get_db)):
    """
    Get all hiring requests received by a specific worker
    """
    requests = db.query(HiringRequest).filter(
        HiringRequest.worker_id == worker_id
    ).order_by(HiringRequest.created_at.desc()).all()
    
    return requests


@router.put("/requests/{request_id}/status", response_model=HiringRequestResponse)
def update_request_status(
    request_id: int,
    status_update: HiringRequestUpdate,
    db: Session = Depends(get_db)
):
    """
    Update the status of a hiring request
    """
    request = db.query(HiringRequest).filter(HiringRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Hiring request not found")
    
    request.status = status_update.status
    
    # If job is completed, increment worker's total jobs
    if status_update.status == "completed":
        worker = db.query(User).filter(User.id == request.worker_id).first()
        if worker:
            worker.total_jobs += 1
    
    db.commit()
    db.refresh(request)
    
    return request


@router.post("/requests/{request_id}/review", response_model=ReviewResponse)
def submit_review(
    request_id: int,
    review_data: ReviewCreate,
    hirer_id: int,  # This should come from JWT token in production
    db: Session = Depends(get_db)
):
    """
    Submit a review after job completion
    """
    # Verify hiring request exists and is completed
    hiring_request = db.query(HiringRequest).filter(
        HiringRequest.id == request_id,
        HiringRequest.status == "completed"
    ).first()
    
    if not hiring_request:
        raise HTTPException(
            status_code=404, 
            detail="Hiring request not found or not completed"
        )
    
    # Verify the hirer is the one who made the request
    if hiring_request.hirer_id != hirer_id:
        raise HTTPException(status_code=403, detail="Unauthorized to review this request")
    
    # Check if review already exists
    existing_review = db.query(Review).filter(
        Review.hiring_request_id == request_id
    ).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already submitted")
    
    # Create review
    review = Review(
        hiring_request_id=request_id,
        worker_id=review_data.worker_id,
        hirer_id=hirer_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    # Update worker's average rating
    update_worker_rating(review_data.worker_id, db)
    
    return review


def update_worker_rating(worker_id: int, db: Session):
    """
    Recalculate and update worker's average rating
    """
    reviews = db.query(Review).filter(Review.worker_id == worker_id).all()
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        worker = db.query(User).filter(User.id == worker_id).first()
        if worker:
            worker.rating = round(avg_rating, 2)
            db.commit()
