import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function WorkerProfile() {
    const { workerId } = useParams();
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "hirer") {
            navigate("/login");
            return;
        }
        fetchWorkerProfile();
    }, [workerId, navigate]);

    async function fetchWorkerProfile() {
        try {
            const res = await API.get(`/users/${workerId}`);
            setWorker(res.data);
        } catch (error) {
            console.error("Error fetching worker profile:", error);
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

    if (!worker) {
        return (
            <div className="dashboard-container">
                <div className="empty-state">
                    <h3>Worker not found</h3>
                    <button className="btn btn-primary" onClick={() => navigate("/browse-workers")}>
                        Back to Browse Workers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container fade-in">
            <div className="dashboard-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-lg)" }}>
                    <div className="user-avatar" style={{ width: "100px", height: "100px", fontSize: "3rem" }}>
                        {worker.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1>{worker.name}</h1>
                        <p style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginTop: "var(--spacing-sm)" }}>
                            <span className={`badge ${worker.is_available ? "badge-success" : "badge-secondary"}`}>
                                {worker.is_available ? "Available" : "Unavailable"}
                            </span>
                            <span style={{ color: "#fbbf24" }}>⭐ {worker.rating || 0}</span>
                            <span style={{ color: "var(--text-muted)" }}>({worker.total_jobs || 0} jobs completed)</span>
                        </p>
                    </div>
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/hire/${worker.id}`)}
                        style={{ marginRight: "var(--spacing-md)" }}
                    >
                        Hire Now
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/browse-workers")}
                    >
                        Back to Browse
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--spacing-lg)" }}>
                {/* Contact Information */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Contact Information</h3>
                    </div>
                    <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Email:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{worker.email}</p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Phone:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{worker.phone || "Not provided"}</p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Location:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{worker.location || "Not provided"}</p>
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Professional Details</h3>
                    </div>
                    <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Skills:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>
                                {worker.skills ? JSON.parse(worker.skills).join(", ") : "Not provided"}
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Experience:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{worker.experience || "0"} years</p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Hourly Rate:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0", fontWeight: "700", color: "var(--primary-color)", fontSize: "var(--font-size-lg)" }}>
                                ${worker.hourly_rate || "0"}/hour
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Statistics</h3>
                    </div>
                    <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Rating:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>
                                <span style={{ fontSize: "var(--font-size-xl)", color: "#fbbf24" }}>⭐ {worker.rating || 0}</span>
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Total Jobs:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0", fontSize: "var(--font-size-lg)", fontWeight: "600" }}>
                                {worker.total_jobs || 0} completed
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Member Since:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>
                                {new Date(worker.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="card" style={{ marginTop: "var(--spacing-xl)" }}>
                <div className="card-body" style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-md)" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/hire/${worker.id}`)}
                    >
                        Send Hiring Request
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/chat?user=${worker.id}`)}
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WorkerProfile;
