import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function HirerDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("role");

        if (!userId || userRole !== "hirer") {
            navigate("/login");
            return;
        }

        fetchDashboardData(userId);
    }, [navigate]);

    async function fetchDashboardData(userId) {
        try {
            // Fetch hiring requests
            const requestsRes = await API.get(`/hiring/requests/hirer/${userId}`);
            setRequests(requestsRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="spinner-lg"></div>
            </div>
        );
    }

    const pendingRequests = requests.filter(r => r.status === "pending");
    const activeRequests = requests.filter(r => r.status === "accepted");
    const completedRequests = requests.filter(r => r.status === "completed");

    const userName = localStorage.getItem("name");

    return (
        <div className="dashboard-container fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {userName}! 💼</h1>
                    <p>Find skilled workers and manage your hiring requests</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Requests</div>
                        <div className="stat-value">{requests.length}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <div className="stat-label">Pending</div>
                        <div className="stat-value">{pendingRequests.length}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-content">
                        <div className="stat-label">Active Jobs</div>
                        <div className="stat-value">{activeRequests.length}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-label">Completed</div>
                        <div className="stat-value">{completedRequests.length}</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <button
                        className="action-card"
                        onClick={() => navigate("/browse-workers")}
                    >
                        <span className="action-icon">🔍</span>
                        <h3>Browse Workers</h3>
                        <p>Find skilled professionals</p>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate("/my-requests")}
                    >
                        <span className="action-icon">📋</span>
                        <h3>My Requests</h3>
                        <p>{requests.length} total requests</p>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate("/chat")}
                    >
                        <span className="action-icon">💬</span>
                        <h3>Messages</h3>
                        <p>Chat with workers</p>
                    </button>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="section">
                <h2>Recent Hiring Requests</h2>
                {requests.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>No hiring requests yet</h3>
                        <p>Start by browsing workers and sending job requests</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/browse-workers")}
                        >
                            Browse Workers
                        </button>
                    </div>
                ) : (
                    <div className="requests-list">
                        {requests.slice(0, 5).map((request) => (
                            <div key={request.id} className="request-item">
                                <div className="request-header">
                                    <h4>{request.job_title}</h4>
                                    <span className={`badge badge-${request.status}`}>
                                        {request.status}
                                    </span>
                                </div>
                                <p className="request-description">{request.job_description}</p>
                                <div className="request-meta">
                                    <span>👷 Worker ID: {request.worker_id}</span>
                                    <span>📍 {request.job_location || "Not specified"}</span>
                                    <span>💰 ${request.offered_rate || 0}/hr</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HirerDashboard;
