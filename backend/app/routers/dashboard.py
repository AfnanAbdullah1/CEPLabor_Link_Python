from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Job

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(
        (Job.hirer_id == user_id) | (Job.labor_id == user_id)
    ).all()

    completed = [j for j in jobs if j.completed]
    pending = [j for j in jobs if not j.completed]

    total_hours = 0
    for j in completed:
        start = j.start_time.hour
        end = j.end_time.hour
        total_hours += (end - start)

    avg_rating = (
        sum([j.rating for j in completed if j.rating]) / len(completed)
        if completed else 0
    )

    return {
        "total_jobs": len(jobs),
        "completed_jobs": len(completed),
        "pending_jobs": len(pending),
        "total_hours": total_hours,
        "average_rating": avg_rating,
        "job_history": jobs
    }
