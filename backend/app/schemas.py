from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

# ========== User Schemas ==========

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "worker" or "hirer"
    phone: Optional[str] = None
    location: Optional[str] = None
    
    @validator('role')
    def validate_role(cls, v):
        if v not in ['worker', 'hirer']:
            raise ValueError('Role must be either "worker" or "hirer"')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    hourly_rate: Optional[float] = None
    is_available: Optional[bool] = None
    profile_image: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None
    skills: Optional[str] = None  # JSON string
    experience: Optional[str] = None
    hourly_rate: Optional[float] = None
    is_available: Optional[bool] = True
    rating: Optional[float] = 0.0
    total_jobs: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True

class WorkerSearchFilters(BaseModel):
    skill: Optional[str] = None
    location: Optional[str] = None
    min_rate: Optional[float] = None
    max_rate: Optional[float] = None
    min_rating: Optional[float] = None
    is_available: Optional[bool] = None

# ========== Chat Schemas ==========

class ChatMessage(BaseModel):
    sender_id: int
    receiver_id: int
    message: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    timestamp: datetime
    is_read: bool

    class Config:
        orm_mode = True
        from_attributes = True

# ========== Hiring Request Schemas ==========

class HiringRequestCreate(BaseModel):
    worker_id: int
    job_title: str
    job_description: str
    job_location: Optional[str] = None
    estimated_hours: Optional[float] = None
    offered_rate: Optional[float] = None

class HiringRequestUpdate(BaseModel):
    status: str  # pending, accepted, rejected, completed, cancelled
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v

class HiringRequestResponse(BaseModel):
    id: int
    hirer_id: int
    worker_id: int
    job_title: str
    job_description: str
    job_location: Optional[str] = None
    estimated_hours: Optional[float] = None
    offered_rate: Optional[float] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    # Include basic user info
    hirer: Optional[UserResponse] = None
    worker: Optional[UserResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True

# ========== Review Schemas ==========

class ReviewCreate(BaseModel):
    hiring_request_id: int
    worker_id: int
    rating: int  # 1-5
    comment: Optional[str] = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class ReviewResponse(BaseModel):
    id: int
    hiring_request_id: int
    worker_id: int
    hirer_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    
    hirer: Optional[UserResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True
