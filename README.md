# CEPLabor_Link_Python

A full-stack labor marketplace platform that connects workers and hirers, enabling seamless job matching, communication, and hiring management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Frontend Routes](#frontend-routes)

## 🎯 Overview

LaborLink is a comprehensive platform designed to bridge the gap between skilled workers and those seeking their services. The platform supports two main user roles:

- **Workers**: Can create profiles, showcase skills, set hourly rates, and receive job requests
- **Hirers**: Can search for workers, send hiring requests, communicate via chat, and leave reviews

## ✨ Features

### Authentication & User Management
- User registration with role selection (Worker/Hirer)
- Secure login with JWT token authentication
- Password hashing using bcrypt
- Role-based access control

### Worker Features
- **Profile Management**: Create and update profiles with skills, experience, hourly rate, and availability
- **Worker Dashboard**: View job requests, manage availability, track completed jobs
- **Search & Discovery**: Workers can be discovered through advanced search filters

### Hirer Features
- **Worker Search**: Advanced search with filters for skills, location, rate range, rating, and availability
- **Hiring Requests**: Create and manage job requests with details like job title, description, location, estimated hours, and offered rate
- **Hirer Dashboard**: Track all hiring requests, view job history, and manage active jobs

### Communication
- **Real-time Chat**: Direct messaging between workers and hirers
- **Conversation Management**: View all conversations with unread message counts
- **Message Status**: Read/unread message tracking

### Job Management
- **Request Lifecycle**: Manage requests through statuses (pending, accepted, rejected, completed, cancelled)
- **Job Tracking**: Automatic tracking of completed jobs and total hours worked
- **Review System**: Rate and review workers after job completion
- **Rating System**: Automatic calculation of average worker ratings based on reviews

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with python-jose
- **Password Hashing**: passlib with bcrypt
- **Validation**: Pydantic for data validation

### Frontend
- **Framework**: React.js 18.2.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Build Tool**: Create React App

## 📁 Project Structure

```
CEPLabor_Link_Python/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── auth_router.py      # Authentication endpoints
│   │   │   └── hashing.py          # Password hashing utilities
│   │   ├── routers/
│   │   │   ├── users.py            # User management endpoints
│   │   │   ├── workers.py          # Worker search and profiles
│   │   │   ├── hiring.py           # Hiring requests and reviews
│   │   │   ├── chat.py             # Messaging endpoints
│   │   │   └── dashboard.py        # Dashboard statistics
│   │   ├── utils/
│   │   │   ├── helpers.py          # Helper functions
│   │   │   └── notifications.py    # Notification utilities
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── models.py               # SQLAlchemy database models
│   │   ├── schemas.py              # Pydantic schemas for validation
│   │   └── database.py             # Database configuration
│   ├── laborlink.db                # SQLite database file
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation component
│   │   │   ├── ChatWindow.jsx      # Chat interface component
│   │   │   └── JobCard.jsx         # Job card component
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx         # Registration page
│   │   │   ├── WorkerDashboard.jsx # Worker dashboard
│   │   │   ├── HirerDashboard.jsx  # Hirer dashboard
│   │   │   ├── Profile.jsx        # User profile page
│   │   │   ├── BrowseWorkers.jsx   # Worker search page
│   │   │   ├── Chat.jsx            # Chat page
│   │   │   ├── MyRequests.jsx     # Hirer's requests page
│   │   │   └── WorkerRequests.jsx # Worker's requests page
│   │   ├── styles/                 # CSS stylesheets
│   │   ├── api.js                  # Axios API configuration
│   │   ├── App.js                  # Main React component
│   │   └── index.js                # React entry point
│   ├── package.json                # Node.js dependencies
│   └── public/                     # Static files
│
└── README.md                       # Project documentation
```

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14.x or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **Linux/Mac**:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

## 💻 Usage

### Starting the Backend Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate your virtual environment (if not already activated)

3. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

You can access the interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### Starting the Frontend Development Server

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Database

The SQLite database (`laborlink.db`) will be automatically created when you first run the backend server. The database tables are created automatically using SQLAlchemy's `create_all()` method.

## 📚 API Documentation

### Authentication Endpoints (`/auth`)

- `POST /auth/register` - Register a new user (worker or hirer)
- `POST /auth/login` - Login and receive JWT token

### User Endpoints (`/users`)

- `GET /users/` - Get all users (optional role filter)
- `GET /users/workers` - Get all workers
- `GET /users/{user_id}` - Get user by ID
- `GET /users/{user_id}/stats` - Get user statistics
- `PUT /users/{user_id}/update` - Update user profile

### Worker Endpoints (`/workers`)

- `GET /workers/search` - Search workers with filters (skill, location, rate, rating, availability)
- `GET /workers/{worker_id}` - Get worker profile by ID
- `GET /workers/{worker_id}/reviews` - Get all reviews for a worker
- `GET /workers/categories/all` - Get predefined skill categories

### Hiring Endpoints (`/hiring`)

- `POST /hiring/requests` - Create a new hiring request
- `GET /hiring/requests/{request_id}` - Get hiring request by ID
- `GET /hiring/requests/hirer/{hirer_id}` - Get all requests by a hirer
- `GET /hiring/requests/worker/{worker_id}` - Get all requests for a worker
- `PUT /hiring/requests/{request_id}/status` - Update request status
- `POST /hiring/requests/{request_id}/review` - Submit a review after job completion

### Chat Endpoints (`/chat`)

- `POST /chat/send` - Send a message
- `GET /chat/conversation/{user1_id}/{user2_id}` - Get conversation between two users
- `GET /chat/conversations/{user_id}` - Get all conversations for a user
- `PUT /chat/mark-read/{message_id}` - Mark message as read
- `GET /chat/unread/{user_id}` - Get unread message count

### Dashboard Endpoints (`/dashboard`)

- `GET /dashboard/{user_id}` - Get dashboard statistics for a user

## 🗄 Database Schema

### User Table
- `id` (Primary Key)
- `name`, `email`, `password`, `role` (worker/hirer)
- `phone`, `location`, `profile_image`
- Worker-specific: `skills`, `experience`, `hourly_rate`, `is_available`, `rating`, `total_jobs`
- Timestamps: `created_at`, `updated_at`

### Message Table
- `id` (Primary Key)
- `sender_id`, `receiver_id` (Foreign Keys to User)
- `message`, `timestamp`, `is_read`

### HiringRequest Table
- `id` (Primary Key)
- `hirer_id`, `worker_id` (Foreign Keys to User)
- `job_title`, `job_description`, `job_location`
- `estimated_hours`, `offered_rate`
- `status` (pending/accepted/rejected/completed/cancelled)
- Timestamps: `created_at`, `updated_at`

### Review Table
- `id` (Primary Key)
- `hiring_request_id` (Foreign Key to HiringRequest)
- `worker_id`, `hirer_id` (Foreign Keys to User)
- `rating` (1-5), `comment`
- `created_at`

## 🎨 Frontend Routes

- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - General dashboard (redirects based on role)
- `/dashboard/worker` - Worker-specific dashboard
- `/dashboard/hirer` - Hirer-specific dashboard
- `/profile` - User profile management
- `/browse-workers` - Search and browse workers
- `/chat` - Messaging interface
- `/my-requests` - Hirer's hiring requests
- `/requests` - Worker's received requests

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS middleware configured for frontend
- Role-based access control
- Input validation using Pydantic schemas

## 📝 Notes

- The backend uses SQLite for simplicity. For production, consider migrating to PostgreSQL or MySQL
- JWT secret key should be moved to environment variables in production
- CORS origins are currently set to localhost:3000 for development
- The database file (`laborlink.db`) is included in the repository for convenience but should be excluded in production

## 🤝 Contributing

This is a project for CEP (Computer Engineering Program). Contributions and improvements are welcome!

## 📄 License

This project is part of an academic program at IUB (Independent University, Bangladesh).

---

**Developed for**: CEP (Computer Engineering Program) - 5th Semester  
**Institution**: Independent University, Bangladesh (IUB)
