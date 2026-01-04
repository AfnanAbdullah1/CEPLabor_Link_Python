from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.auth import auth_router
from app.routers import users, hiring, chat, services
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LaborLink API", version="1.0.0")

# Configure CORS
# Get CORS origins from environment variable or use defaults
cors_origins_env = os.getenv("CORS_ORIGINS", "")
cors_origins = []

if cors_origins_env:
    # Production: use environment variable (comma-separated)
    cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]
else:
    # Development: use localhost and local network IPs
    cors_origins = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://192.168.1.19:3000",  # Previous network IP
        "http://10.122.168.236:3000",  # New network IP
        "http://192.168.1.19:8000",
        "http://10.122.168.236:8000"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(users.router)
app.include_router(hiring.router)
app.include_router(chat.router)
app.include_router(services.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LaborLink API", "status": "active"}

