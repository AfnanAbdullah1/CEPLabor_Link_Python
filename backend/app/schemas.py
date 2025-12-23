from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: str  # 'worker' or 'hirer'
    location: Optional[str] = None
    experience: Optional[int] = 0
    skills: Optional[List[str]] = None
    hourly_rate: Optional[float] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    experience: Optional[int] = None
    profile_image: Optional[str] = None
    skills: Optional[List[str]] = None
    hourly_rate: Optional[float] = None
    is_available: Optional[bool] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    role: str
    location: Optional[str]
    experience: Optional[int]
    profile_image: Optional[str]
    skills: Optional[str]
    hourly_rate: Optional[float]
    is_available: Optional[bool]
    rating: float
    total_jobs: int
    created_at: datetime

    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Hiring Request Schemas
class HiringRequestCreate(BaseModel):
    worker_id: int
    job_title: str
    job_description: str
    job_location: Optional[str] = None
    estimated_hours: Optional[float] = None
    offered_rate: Optional[float] = None


class HiringRequestUpdate(BaseModel):
    status: str  # pending, accepted, rejected, completed


class HiringRequestResponse(BaseModel):
    id: int
    hirer_id: int
    worker_id: int
    job_title: str
    job_description: str
    job_location: Optional[str]
    estimated_hours: Optional[float]
    offered_rate: Optional[float]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Review Schemas
class ReviewCreate(BaseModel):
    worker_id: int
    rating: float
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    hiring_request_id: int
    worker_id: int
    hirer_id: int
    rating: float
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Message Schemas
class MessageCreate(BaseModel):
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
        from_attributes = True


class ConversationResponse(BaseModel):
    user_id: int
    user_name: str
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int
