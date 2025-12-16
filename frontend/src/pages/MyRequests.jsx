import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function MyRequests() {
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

        fetchRequests(userId);
    }, [navigate]);

    async function fetchRequests(userId) {
        try {
            const res = await API.get(`/hiring/requests/hirer/${userId}`);
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
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

    return (
        <div className="dashboard-container fade-in">
            <div className="dashboard-header">
                <h1>My Hiring Requests 📋</h1>
                <p>Track and manage your job requests</p>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: "var(--spacing-2xl)" }}>
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
                        <div className="stat-label">Active</div>
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

            {/* Requests List */}
            <div className="section">
                <h2>All Requests</h2>

                {requests.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>No hiring requests yet</h3>
                        <p>Browse workers and send your first job request</p>
                        <button className="btn btn-primary" onClick={() => navigate("/browse-workers")}>
                            Browse Workers
                        </button>
                    </div>
                ) : (
                    <div className="requests-list">
                        {requests.map((request) => (
                            <div key={request.id} className="request-item">
                                <div className="request-header">
                                    <div>
                                        <h4>{request.job_title}</h4>
                                        <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", margin: "var(--spacing-xs) 0" }}>
                                            Request ID: #{request.id}
                                        </p>
                                    </div>
                                    <span className={`badge badge-${request.status}`}>
                                        {request.status}
                                    </span>
                                </div>

                                <p className="request-description">{request.job_description}</p>

                                <div className="request-meta">
                                    <span>👷 Worker ID: {request.worker_id}</span>
                                    <span>📍 {request.job_location || "Not specified"}</span>
                                    <span>⏱️ {request.estimated_hours || 0} hours</span>
                                    <span>💰 ${request.offered_rate || 0}/hr</span>
                                </div>

                                <div style={{
                                    marginTop: "var(--spacing-md)",
                                    paddingTop: "var(--spacing-md)",
                                    borderTop: "1px solid var(--glass-border)",
                                    fontSize: "var(--font-size-sm)",
                                    color: "var(--text-muted)"
                                }}>
                                    <p style={{ margin: 0 }}>
                                        Created: {new Date(request.created_at).toLocaleDateString()}
                                        {" | "}
                                        Updated: {new Date(request.updated_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {request.status === "completed" && (
                                    <div style={{ marginTop: "var(--spacing-md)" }}>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/review/${request.id}`)}
                                        >
                                            Leave Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyRequests;
