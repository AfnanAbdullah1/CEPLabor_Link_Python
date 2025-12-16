from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Message, User
from app.schemas import ChatMessage, MessageResponse

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/send", response_model=MessageResponse)
def send_message(msg: ChatMessage, db: Session = Depends(get_db)):
    """
    Send a message from sender to receiver
    """
    # Verify both users exist
    sender = db.query(User).filter(User.id == msg.sender_id).first()
    receiver = db.query(User).filter(User.id == msg.receiver_id).first()
    
    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="Sender or receiver not found")
    
    new_message = Message(
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        message=msg.message,
        timestamp=datetime.utcnow(),
        is_read=False
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message


@router.get("/conversation/{user1_id}/{user2_id}", response_model=List[MessageResponse])
def get_conversation(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    """
    Get all messages between two users
    """
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.timestamp.asc()).all()
    
    return messages


@router.get("/conversations/{user_id}")
def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    """
    Get all conversations for a user (list of users they've chatted with)
    """
    # Get all unique users this user has messaged or been messaged by
    sent_to = db.query(Message.receiver_id).filter(Message.sender_id == user_id).distinct().all()
    received_from = db.query(Message.sender_id).filter(Message.receiver_id == user_id).distinct().all()
    
    user_ids = set([u[0] for u in sent_to] + [u[0] for u in received_from])
    
    conversations = []
    for uid in user_ids:
        other_user = db.query(User).filter(User.id == uid).first()
        if other_user:
            # Get last message
            last_msg = db.query(Message).filter(
                or_(
                    and_(Message.sender_id == user_id, Message.receiver_id == uid),
                    and_(Message.sender_id == uid, Message.receiver_id == user_id)
                )
            ).order_by(Message.timestamp.desc()).first()
            
            # Count unread messages from this user
            unread_count = db.query(Message).filter(
                Message.sender_id == uid,
                Message.receiver_id == user_id,
                Message.is_read == False
            ).count()
            
            conversations.append({
                "user_id": other_user.id,
                "name": other_user.name,
                "profile_image": other_user.profile_image,
                "last_message": last_msg.message if last_msg else None,
                "last_message_time": last_msg.timestamp if last_msg else None,
                "unread_count": unread_count
            })
    
    return conversations


@router.put("/mark-read/{message_id}")
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    """
    Mark a message as read
    """
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    db.commit()
    
    return {"message": "Message marked as read"}


@router.get("/unread/{user_id}")
def get_unread_count(user_id: int, db: Session = Depends(get_db)):
    """
    Get total unread message count for a user
    """
    count = db.query(Message).filter(
        Message.receiver_id == user_id,
        Message.is_read == False
    ).count()
    
    return {"unread_count": count}

