from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    phone = Column(String)
    role = Column(String, nullable=False)  # 'worker' or 'hirer'
    location = Column(String)
    experience = Column(Integer, default=0)
    profile_image = Column(String)
    
    # Worker-specific fields
    skills = Column(Text)  # JSON string
    hourly_rate = Column(Float)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    total_jobs = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    hiring_requests_as_hirer = relationship("HiringRequest", back_populates="hirer", foreign_keys="HiringRequest.hirer_id")
    hiring_requests_as_worker = relationship("HiringRequest", back_populates="worker", foreign_keys="HiringRequest.worker_id")
    reviews = relationship("Review", back_populates="worker", foreign_keys="Review.worker_id")


class HiringRequest(Base):
    __tablename__ = "hiring_requests"

    id = Column(Integer, primary_key=True, index=True)
    hirer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    job_location = Column(String)
    estimated_hours = Column(Float)
    offered_rate = Column(Float)
    status = Column(String, default="pending")  # pending, accepted, rejected, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    hirer = relationship("User", back_populates="hiring_requests_as_hirer", foreign_keys=[hirer_id])
    worker = relationship("User", back_populates="hiring_requests_as_worker", foreign_keys=[worker_id])
    review = relationship("Review", back_populates="hiring_request", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    hiring_request_id = Column(Integer, ForeignKey("hiring_requests.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hirer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    hiring_request = relationship("HiringRequest", back_populates="review")
    worker = relationship("User", back_populates="reviews", foreign_keys=[worker_id])
