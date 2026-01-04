# LaborLink - Complete Labor Marketplace Platform

A full-stack web application connecting skilled workers with hirers for job opportunities. Built with FastAPI (Python) backend and React.js frontend.

> **🚀 Deploy for FREE Forever!** Deploy to Vercel + Supabase - 100% free with no expiration. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for step-by-step instructions.

## 🎯 Overview

LaborLink is a comprehensive marketplace platform that bridges the gap between skilled labor workers and those seeking their services. The platform enables seamless job matching, real-time communication, hiring management, and quality feedback through reviews.

## ✨ Key Features

### 🔐 Authentication & Security
- User registration with role selection (Worker/Hirer)
- Secure JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes and API endpoints

### 👷 Worker Features
- **Profile Management**: Create detailed profiles with skills, experience, hourly rates, and availability status
- **Worker Dashboard**: View job requests, track earnings, manage profile visibility
- **Job Requests**: Accept/reject hiring requests
- **Ratings & Reviews**: Build reputation through client feedback
- **Messaging**: Direct communication with potential hirers

### 💼 Hirer Features
- **Advanced Worker Search**: Filter by skills, location, hourly rate, rating, and availability
- **Worker Profiles**: View detailed worker information, ratings, and past job history
- **Hiring Requests**: Send job offers with details (title, description, location, hours, rate)
- **Request Management**: Track all hiring requests with status updates
- **Chat System**: Communicate directly with workers
- **Review System**: Rate and review workers after job completion

### 💬 Real-Time Communication
- One-on-one messaging between workers and hirers
- Conversation history with read/unread status
- Unread message notifications
- Start conversations directly from worker profiles

### ⭐ Review & Rating System
- 5-star rating system for completed jobs
- Optional written comments for detailed feedback
- Automatic worker rating calculation
- Review history and statistics

### 📱 Mobile & Network Access
- Responsive design works on all devices
- Network-accessible (supports both localhost and LAN access)
- Environment-based configuration for easy deployment

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: SQLite (development) / PostgreSQL (production) with SQLAlchemy 2.0.23 ORM
- **Authentication**: python-jose 3.3.0 (JWT tokens)
- **Password Security**: passlib 1.7.4 with bcrypt
- **Validation**: Pydantic (built into FastAPI)
- **CORS**: FastAPI CORS middleware
- **Environment**: python-dotenv 1.0.0

### Frontend
- **Framework**: React.js 18.2.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Build Tool**: Create React App
- **Styling**: Custom CSS with modern design system

## 📁 Project Structure

```
CEPLabor_Link_Python/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── auth_router.py      # Login/Signup endpoints
│   │   │   └── hashing.py          # Password hashing
│   │   ├── routers/
│   │   │   ├── users.py            # User CRUD operations
│   │   │   ├── hiring.py           # Hiring requests & reviews
│   │   │   ├── chat.py             # Messaging system
│   │   │   └── services.py         # Service listings
│   │   ├── models.py               # Database models
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── database.py             # Database configuration
│   │   └── main.py                 # FastAPI app entry point
│   ├── laborlink.db                # SQLite database
│   ├── migrate_database.py         # Database migration script
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Navigation bar
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx          # Registration page
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── WorkerDashboard.jsx # Worker-specific dashboard
│   │   │   ├── HirerDashboard.jsx  # Hirer-specific dashboard
│   │   │   ├── BrowseWorkers.jsx   # Worker search/browse
│   │   │   ├── WorkerProfile.jsx   # Individual worker profile
│   │   │   ├── Profile.jsx         # User profile management
│   │   │   ├── HireWorker.jsx      # Send hiring request form
│   │   │   ├── MyRequests.jsx      # Hirer's request tracking
│   │   │   ├── WorkerRequests.jsx  # Worker's request management
│   │   │   ├── Chat.jsx            # Messaging interface
│   │   │   └── ReviewForm.jsx      # Submit worker reviews
│   │   ├── styles/
│   │   │   └── dashboard.css       # Main stylesheet
│   │   ├── api.js                  # Axios configuration
│   │   ├── App.js                  # Main app component
│   │   └── index.js                # React entry point
│   ├── package.json
│   └── .env                        # Environment variables (gitignored)
│
├── .env.example                    # Example environment variables
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update values as needed (SECRET_KEY, DATABASE_URL, etc.)

5. **Initialize database:**
   ```bash
   # Database tables are created automatically on first run
   # Or run migration script:
   python migrate_database.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   - Create `.env` file in frontend directory
   - Add: `REACT_APP_API_URL=http://your-backend-url:8000`
   - Default is `http://localhost:8000`

## 💻 Usage

### Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will run on: `http://localhost:8000`

**Note:** Use `--host 0.0.0.0` for network access (mobile/other devices)

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

### Network Access (Mobile/Other Devices)

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. **Start backend with network binding:**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Update frontend API URL:**
   - Create `frontend/.env` file:
     ```
     REACT_APP_API_URL=http://YOUR_IP_ADDRESS:8000
     ```
   - Or update `frontend/src/api.js` fallback URL

4. **Access from mobile:**
   - Open browser on your phone
   - Navigate to: `http://YOUR_IP_ADDRESS:3000`

## 🌐 Deployment to Production

Deploy LaborLink to the cloud - **100% FREE FOREVER!**

### 🏆 Recommended: Vercel + Supabase (FREE FOREVER)

**See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete guide**

✅ **Benefits:**
- Completely free with no expiration
- No credit card required
- Fast auto-deploy from GitHub
- Perfect for students and portfolios

#### Quick Steps:
1. Create Supabase account → Setup database
2. Deploy backend to Vercel
3. Deploy frontend to Vercel
4. Your app is live! 🎉

**Total time:** ~30-40 minutes

---

### Alternative: Render (Free for 30 days)

**See [DEPLOYMENT.md](DEPLOYMENT.md) for Render deployment**

⚠️ Note: Render's free PostgreSQL expires after 30 days

### Default User Roles

After signup, users can choose their role:
- **Worker**: Create profile, receive job requests, chat with hirers
- **Hirer**: Browse workers, send hiring requests, leave reviews

##  📡 API Documentation

Once the backend is running, access interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main API Endpoints

#### Authentication (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

#### Users (`/users`)
- `GET /users/` - Get all users (with optional role filter)
- `GET /users/{id}` - Get user by ID
- `GET /users/workers` - Get all workers
- `PUT /users/{id}/update` - Update user profile

#### Hiring (`/hiring`)
- `POST /hiring/requests?hirer_id={id}` - Create hiring request
- `GET /hiring/requests/hirer/{id}` - Get hirer's requests
- `GET /hiring/requests/worker/{id}` - Get worker's requests
- `PUT /hiring/requests/{id}/status` - Update request status
- `POST /hiring/requests/{id}/review?hirer_id={id}` - Submit review

#### Chat (`/chat`)
- `POST /chat/send?sender_id={id}` - Send message
- `GET /chat/conversations/{user_id}` - Get all conversations
- `GET /chat/conversation/{user1_id}/{user2_id}` - Get messages
- `PUT /chat/mark-read/{message_id}` - Mark message as read
- `GET /chat/unread/{user_id}` - Get unread count

## 🗄 Database Schema

### Tables

#### 1. **users**
- `id` - Primary key
- `name` - Full name
- `email` - Unique email (login identifier)
- `password` - Hashed password
- `role` - 'worker' or 'hirer'
- `phone`, `location`, `experience` - Profile details
- `skills` - JSON array of skills (for workers)
- `hourly_rate` - Worker's rate (for workers)
- `is_available` - Availability status (for workers)
- `rating` - Average rating (calculated from reviews)
- `total_jobs` - Completed jobs count
- `created_at` - Registration timestamp

#### 2. **hiring_requests**
- `id` - Primary key
- `hirer_id` - Foreign key to users
- `worker_id` - Foreign key to users
- `job_title`, `job_description`, `job_location` - Job details
- `estimated_hours`, `offered_rate` - Job terms
- `status` - 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
- `created_at` - Request timestamp

#### 3. **messages**
- `id` - Primary key
- `sender_id` - Foreign key to users
- `receiver_id` - Foreign key to users
- `message` - Message content
- `timestamp` - Message time
- `is_read` - Read status boolean

#### 4. **reviews**
- `id` - Primary key
- `hiring_request_id` - Foreign key to hiring_requests
- `worker_id` - Foreign key to users (worker being reviewed)
- `hirer_id` - Foreign key to users (reviewer)
- `rating` - 1-5 star rating
- `comment` - Optional review text
- `created_at` - Review timestamp

## 🧭 Frontend Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| `/` | Dashboard | Redirects based on auth status | Public |
| `/login` | Login | User login | Public |
| `/signup` | Signup | User registration | Public |
| `/dashboard/worker` | WorkerDashboard | Worker main dashboard | Worker only |
| `/dashboard/hirer` | HirerDashboard | Hirer main dashboard | Hirer only |
| `/profile` | Profile | User profile management | Protected |
| `/browse-workers` | BrowseWorkers | Search and filter workers | Hirer only |
| `/worker/:id` | WorkerProfile | View worker details | Hirer only |
| `/hire/:workerId` | HireWorker | Send hiring request | Hirer only |
| `/my-requests` | MyRequests | Hirer's request tracking | Hirer only |
| `/requests` | WorkerRequests | Worker's request management | Worker only |
| `/review/:requestId` | ReviewForm | Submit worker review | Hirer only |
| `/chat` | Chat | Messaging interface | Protected |

## 🎨 Features Showcase

### For Workers:
1. Create comprehensive profile with skills and hourly rate
2. Set availability status (Available/Unavailable)
3. Receive and manage job requests
4. View request details (job description, offered rate, etc.)
5. Accept or reject requests
6. Communicate with hirers via chat
7. Build reputation through ratings and reviews

### For Hirers:
1. Browse all available workers
2. Filter workers by skills, location, rate, rating
3. View detailed worker profiles
4. Send customized hiring requests
5. Track all requests (pending/active/completed)
6. Communicate with workers
7. Submit reviews and ratings after job completion

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
```env
DATABASE_URL=sqlite:///./laborlink.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
HOST=0.0.0.0
PORT=8000
```

#### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:8000
# For network access:
# REACT_APP_API_URL=http://YOUR_IP_ADDRESS:8000
```

## 📝 Recent Updates

### Latest Features (December 2025)
- ✅ Complete review system with 5-star ratings
- ✅ Environment-based configuration
- ✅ Network access support for mobile devices
- ✅ Fixed React hook warnings
- ✅ Removed deprecated components
- ✅ Enhanced CORS configuration
- ✅ Improved error handling

## 🤝 Contributing

This is an academic project developed as part of a Computer Engineering Program.

## 📄 License

This project is for educational purposes.

## 👨‍💻 Developer

Developed as part of CEP (Computer Engineering Program) coursework.

## 🐛 Known Issues & Limitations

- Currently uses SQLite (consider PostgreSQL for production)
- No real-time WebSocket support for chat (uses polling)
- No image upload functionality yet
- No payment integration
- No email notifications

## 🔮 Future Enhancements

- [ ] Real-time chat with WebSockets
- [ ] Email notifications
- [ ] Image upload for profiles
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Worker portfolio/gallery
- [ ] Job history and earnings reports
- [ ] Multi-language support
- [ ] Mobile native apps (React Native)

## 📞 Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ using FastAPI and React.js**
