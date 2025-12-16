from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "worker" or "hirer"
    
    # Contact & Location
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)  # URL or file path
    
    # Worker-specific fields
    skills = Column(Text, nullable=True)  # JSON string array
    experience = Column(String, default="", nullable=True)
    hourly_rate = Column(Float, nullable=True)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)  # Average rating 0-5
    total_jobs = Column(Integer, default=0)  # Jobs completed
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    hiring_requests_sent = relationship("HiringRequest", foreign_keys="HiringRequest.hirer_id", back_populates="hirer")
    hiring_requests_received = relationship("HiringRequest", foreign_keys="HiringRequest.worker_id", back_populates="worker")
    reviews_received = relationship("Review", foreign_keys="Review.worker_id", back_populates="worker")
    reviews_given = relationship("Review", foreign_keys="Review.hirer_id", back_populates="hirer")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


class HiringRequest(Base):
    __tablename__ = "hiring_requests"

    id = Column(Integer, primary_key=True, index=True)
    hirer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    job_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    job_location = Column(String, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    offered_rate = Column(Float, nullable=True)
    
    status = Column(String, default="pending")  # pending, accepted, rejected, completed, cancelled
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    hirer = relationship("User", foreign_keys=[hirer_id], back_populates="hiring_requests_sent")
    worker = relationship("User", foreign_keys=[worker_id], back_populates="hiring_requests_received")
    review = relationship("Review", back_populates="hiring_request", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    hiring_request_id = Column(Integer, ForeignKey("hiring_requests.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hirer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    hiring_request = relationship("HiringRequest", back_populates="review")
    worker = relationship("User", foreign_keys=[worker_id], back_populates="reviews_received")
    hirer = relationship("User", foreign_keys=[hirer_id], back_populates="reviews_given")
