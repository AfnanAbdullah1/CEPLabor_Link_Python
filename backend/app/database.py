from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./laborlink.db")

# Determine if using PostgreSQL or SQLite
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL connection (production)
    engine = create_engine(DATABASE_URL)
else:
    # SQLite connection (local development)
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
