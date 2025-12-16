from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt

from app.schemas import UserCreate, UserLogin, UserResponse
from app.models import User
from app.database import get_db
from app.auth.hashing import Hash

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = "MYSECRET"
ALGORITHM = "HS256"

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(hours=10)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Validate role
    if user.role not in ['worker', 'hirer']:
        raise HTTPException(status_code=400, detail="Role must be either 'worker' or 'hirer'")
    
    user_exists = db.query(User).filter(User.email == user.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=Hash.encrypt(user.password),
        role=user.role,
        phone=user.phone,
        location=user.location
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not Hash.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid login details")

    token = create_token({"id": db_user.id, "email": db_user.email, "role": db_user.role})
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "role": db_user.role,
        "name": db_user.name
    }
