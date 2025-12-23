from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Message, User
from app.schemas import MessageCreate, MessageResponse, ConversationResponse

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/send", response_model=MessageResponse)
def send_message(message_data: MessageCreate, sender_id: int, db: Session = Depends(get_db)):
    """Send a message from sender to receiver"""
    # Verify receiver exists
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    # Create message
    new_message = Message(
        sender_id=sender_id,
        receiver_id=message_data.receiver_id,
        message=message_data.message,
        timestamp=datetime.utcnow(),
        is_read=False
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message


@router.get("/conversation/{user1_id}/{user2_id}", response_model=List[MessageResponse])
def get_conversation(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    """Get all messages between two users"""
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.timestamp.asc()).all()
    
    return messages


@router.get("/conversations/{user_id}", response_model=List[ConversationResponse])
def get_conversations(user_id: int, db: Session = Depends(get_db)):
    """Get all conversations for a user with last message and unread count"""
    # Get all unique users this user has chatted with
    sent_to = db.query(Message.receiver_id).filter(Message.sender_id == user_id).distinct()
    received_from = db.query(Message.sender_id).filter(Message.receiver_id == user_id).distinct()
    
    # Combine and get unique user IDs
    conversation_user_ids = set()
    for msg in sent_to:
        conversation_user_ids.add(msg[0])
    for msg in received_from:
        conversation_user_ids.add(msg[0])
    
    conversations = []
    for other_user_id in conversation_user_ids:
        # Get the other user's info
        other_user = db.query(User).filter(User.id == other_user_id).first()
        if not other_user:
            continue
        
        # Get last message
        last_message = db.query(Message).filter(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
                and_(Message.sender_id == other_user_id, Message.receiver_id == user_id)
            )
        ).order_by(Message.timestamp.desc()).first()
        
        # Get unread count
        unread_count = db.query(Message).filter(
            Message.sender_id == other_user_id,
            Message.receiver_id == user_id,
            Message.is_read == False
        ).count()
        
        conversations.append(ConversationResponse(
            user_id=other_user.id,
            user_name=other_user.name,
            last_message=last_message.message if last_message else None,
            last_message_time=last_message.timestamp if last_message else None,
            unread_count=unread_count
        ))
    
    # Sort by last message time (most recent first)
    conversations.sort(key=lambda x: x.last_message_time or datetime.min, reverse=True)
    
    return conversations


@router.put("/mark-read/{message_id}", response_model=MessageResponse)
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    """Mark a message as read"""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    db.commit()
    db.refresh(message)
    
    return message


@router.get("/unread/{user_id}")
def get_unread_count(user_id: int, db: Session = Depends(get_db)):
    """Get total unread message count for a user"""
    unread_count = db.query(Message).filter(
        Message.receiver_id == user_id,
        Message.is_read == False
    ).count()
    
    return {"unread_count": unread_count}
