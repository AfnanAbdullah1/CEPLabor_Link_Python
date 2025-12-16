import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function WorkerDashboard() {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("role");

        if (!userId || userRole !== "worker") {
            navigate("/login");
            return;
        }

        fetchDashboardData(userId);
    }, [navigate]);

    async function fetchDashboardData(userId) {
        try {
            // Fetch user profile
            const userRes = await API.get(`/users/${userId}`);
            setUser(userRes.data);

            // Fetch hiring requests
            const requestsRes = await API.get(`/hiring/requests/worker/${userId}`);
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

    return (
        <div className="dashboard-container fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.name}! 👷</h1>
                    <p>Manage your work opportunities and track your progress</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-label">Profile Rating</div>
                        <div className="stat-value">{user?.rating || 0} ⭐</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-label">Jobs Completed</div>
                        <div className="stat-value">{user?.total_jobs || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔔</div>
                    <div className="stat-content">
                        <div className="stat-label">Pending Requests</div>
                        <div className="stat-value">{pendingRequests.length}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-label">Hourly Rate</div>
                        <div className="stat-value">${user?.hourly_rate || 0}</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <button
                        className="action-card"
                        onClick={() => navigate("/profile")}
                    >
                        <span className="action-icon">👤</span>
                        <h3>Update Profile</h3>
                        <p>Add skills and experience</p>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate("/requests")}
                    >
                        <span className="action-icon">📋</span>
                        <h3>View Requests</h3>
                        <p>{pendingRequests.length} pending</p>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate("/chat")}
                    >
                        <span className="action-icon">💬</span>
                        <h3>Messages</h3>
                        <p>Chat with hirers</p>
                    </button>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="section">
                <h2>Recent Job Requests</h2>
                {requests.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>No job requests yet</h3>
                        <p>Keep your profile updated to receive opportunities</p>
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
                                    <span>📍 {request.job_location || "Not specified"}</span>
                                    <span>⏱️ {request.estimated_hours || 0} hours</span>
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

export default WorkerDashboard;
