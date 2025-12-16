import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function WorkerRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("role");

        if (!userId || userRole !== "worker") {
            navigate("/login");
            return;
        }

        fetchRequests(userId);
    }, [navigate]);

    async function fetchRequests(userId) {
        try {
            const res = await API.get(`/hiring/requests/worker/${userId}`);
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateRequestStatus(requestId, status) {
        setUpdating(requestId);
        try {
            await API.put(`/hiring/requests/${requestId}/status`, { status });

            // Refresh requests
            const userId = localStorage.getItem("user_id");
            fetchRequests(userId);

            alert(`Request ${status} successfully!`);
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Failed to update request status");
        } finally {
            setUpdating(null);
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
                <h1>Job Requests 📋</h1>
                <p>Review and manage hiring requests</p>
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

            {/* Requests List */}
            <div className="section">
                <h2>All Requests</h2>

                {requests.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>No job requests yet</h3>
                        <p>Keep your profile updated to receive opportunities from hirers</p>
                        <button className="btn btn-primary" onClick={() => navigate("/profile")}>
                            Update Profile
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
                                            From Hirer ID: #{request.hirer_id}
                                        </p>
                                    </div>
                                    <span className={`badge badge-${request.status}`}>
                                        {request.status}
                                    </span>
                                </div>

                                <p className="request-description">{request.job_description}</p>

                                <div className="request-meta">
                                    <span>📍 {request.job_location || "Not specified"}</span>
                                    <span>⏱️ {request.estimated_hours || 0} hours</span>
                                    <span>💰 ${request.offered_rate || 0}/hr</span>
                                    <span style={{ fontWeight: "700", color: "var(--primary-color)" }}>
                                        Total: ${((request.estimated_hours || 0) * (request.offered_rate || 0)).toFixed(2)}
                                    </span>
                                </div>

                                <div style={{
                                    marginTop: "var(--spacing-md)",
                                    paddingTop: "var(--spacing-md)",
                                    borderTop: "1px solid var(--glass-border)",
                                    fontSize: "var(--font-size-sm)",
                                    color: "var(--text-muted)"
                                }}>
                                    <p style={{ margin: 0 }}>
                                        Received: {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {request.status === "pending" && (
                                    <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => updateRequestStatus(request.id, "accepted")}
                                            disabled={updating === request.id}
                                        >
                                            {updating === request.id ? "Updating..." : "Accept"}
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => updateRequestStatus(request.id, "rejected")}
                                            disabled={updating === request.id}
                                            style={{ background: "var(--error-color)" }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {request.status === "accepted" && (
                                    <div style={{ marginTop: "var(--spacing-md)" }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => updateRequestStatus(request.id, "completed")}
                                            disabled={updating === request.id}
                                        >
                                            {updating === request.id ? "Updating..." : "Mark as Completed"}
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

export default WorkerRequests;
