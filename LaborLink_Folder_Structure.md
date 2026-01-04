# LaborLink Project Structure

**Generated:** January 2026  
**Project:** LaborLink - Complete Labor Marketplace Platform

## Directory Tree

```text
CEPLabor_Link_Python/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── auth_router.py      # Login/Signup endpoints
│   │   │   └── hashing.py          # Password hashing
│   │   ├── routers/
│   │   │   ├── chat.py             # Messaging system
│   │   │   ├── hiring.py           # Hiring requests & reviews
│   │   │   ├── services.py         # Service listings
│   │   │   └── users.py            # User CRUD operations
│   │   ├── utils/
│   │   │   ├── helpers.py          # Helper functions
│   │   │   └── notifications.py    # Notification utilities
│   │   ├── database.py             # Database configuration
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── models.py               # Database models
│   │   └── schemas.py              # Pydantic schemas
│   ├── laborlink.db                # SQLite database
│   ├── migrate_database.py         # Database migration script
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx      # Chat window component
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   └── Navbar.css          # Navbar styles
│   │   ├── pages/
│   │   │   ├── BrowseWorkers.jsx   # Worker search page
│   │   │   ├── Chat.jsx            # Messaging request page
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── HirerDashboard.jsx  # Hirer interface
│   │   │   ├── HireWorker.jsx      # Hiring form
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── MyRequests.jsx      # Request tracking
│   │   │   ├── Profile.jsx         # Profile management
│   │   │   ├── ReviewForm.jsx      # Review submission
│   │   │   ├── Signup.jsx          # Registration page
│   │   │   ├── WorkerDashboard.jsx # Worker interface
│   │   │   ├── WorkerProfile.jsx   # Public worker profile
│   │   │   └── WorkerRequests.jsx  # Request management
│   │   ├── styles/
│   │   │   └── (CSS files)
│   │   ├── api.js                  # API configuration
│   │   ├── App.js                  # Main application component
│   │   └── index.js                # Entry point
│   ├── package.json
│   └── .env
│
├── CEP_Report_LaborLink.md         # Full Project Report
├── CEP_Python_Guidelines.pdf
└── README.md
```

## Summary

- **Total Directories:** 10+
- **Total Files:** 40+
- **Backend Framework:** FastAPI
- **Frontend Framework:** React.js
