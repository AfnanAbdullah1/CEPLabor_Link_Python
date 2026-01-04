-- LaborLink Database Schema for Supabase
-- Run this in Supabase SQL Editor after creating your project

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('worker', 'hirer')),
    location VARCHAR(255),
    experience INTEGER DEFAULT 0,
    profile_image VARCHAR(500),
    skills TEXT,
    hourly_rate FLOAT,
    is_available BOOLEAN DEFAULT true,
    rating FLOAT DEFAULT 0.0,
    total_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Hiring requests table
CREATE TABLE IF NOT EXISTS hiring_requests (
    id SERIAL PRIMARY KEY,
    hirer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    job_location VARCHAR(255),
    estimated_hours FLOAT,
    offered_rate FLOAT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_hiring_requests_hirer ON hiring_requests(hirer_id);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_worker ON hiring_requests(worker_id);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_status ON hiring_requests(status);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    hiring_request_id INTEGER NOT NULL REFERENCES hiring_requests(id) ON DELETE CASCADE,
    worker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hirer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating FLOAT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_worker ON reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hirer ON reviews(hirer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hiring_request ON reviews(hiring_request_id);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT false
);

-- Create indexes for faster message queries
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);

-- Success message
SELECT 'LaborLink database schema created successfully!' AS status;
