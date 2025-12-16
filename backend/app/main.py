from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.auth import auth_router
from app.routers import users, chat, workers, hiring

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LaborLink API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(users.router)
app.include_router(chat.router)
app.include_router(workers.router)
app.include_router(hiring.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LaborLink API", "status": "active"}

