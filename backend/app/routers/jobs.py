from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Job
from app.schemas import JobRequest, JobStatusUpdate

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/create")
def create_job(request: JobRequest, hirer_id: int, db: Session = Depends(get_db)):
    job = Job(
        hirer_id=hirer_id,
        labor_id=request.labor_id,
        service=request.service,
        date=datetime.strptime(request.date, "%Y-%m-%d"),
        wage=request.wage,
        status="pending"
    )
    db.add(job)
    db.commit()
    return {"message": "Job request sent"}


@router.put("/status")
def update_job_status(data: JobStatusUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == data.job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = data.status
    db.commit()

    return {"message": "Job status updated"}


@router.get("/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    return job


@router.get("/user/{user_id}")
def get_user_jobs(user_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(
        (Job.hirer_id == user_id) | (Job.labor_id == user_id)
    ).all()
    return jobs
