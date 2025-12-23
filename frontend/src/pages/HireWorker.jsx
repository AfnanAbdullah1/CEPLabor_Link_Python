import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function HireWorker() {
    const { workerId } = useParams();
    const [worker, setWorker] = useState(null);
    const [formData, setFormData] = useState({
        job_title: "",
        job_description: "",
        job_location: "",
        estimated_hours: "",
        offered_rate: "",
        start_date: ""
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const hirerId = parseInt(localStorage.getItem("user_id"));

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "hirer") {
            navigate("/login");
            return;
        }
        fetchWorker();
    }, [workerId, navigate]);

    async function fetchWorker() {
        try {
            const res = await API.get(`/users/${workerId}`);
            setWorker(res.data);
            // Pre-fill offered rate with worker's hourly rate
            setFormData(prev => ({ ...prev, offered_rate: res.data.hourly_rate || "" }));
        } catch (error) {
            console.error("Error fetching worker:", error);
            setError("Failed to load worker information");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const requestData = {
                worker_id: parseInt(workerId),
                job_title: formData.job_title,
                job_description: formData.job_description,
                job_location: formData.job_location,
                estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
                offered_rate: formData.offered_rate ? parseFloat(formData.offered_rate) : null,
                start_date: formData.start_date || null
            };

            // Backend expects hirer_id as query parameter
            await API.post(`/hiring/requests?hirer_id=${hirerId}`, requestData);

            // Success! Navigate to my requests page
            navigate("/my-requests", {
                state: { message: "Hiring request sent successfully!" }
            });
        } catch (err) {
            console.error("Error sending hiring request:", err);
            setError(err.response?.data?.detail || "Failed to send hiring request. Please try again.");
        } finally {
            setSubmitting(false);
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
                <div>
                    <h1>Send Hiring Request 💼</h1>
                    <p>Send a job offer to {worker.name}</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(`/worker/${workerId}`)}>
                    Back to Profile
                </button>
            </div>

            {/* Worker Summary Card */}
            <div className="card" style={{ marginBottom: "var(--spacing-xl)" }}>
                <div className="card-body" style={{ display: "flex", alignItems: "center", gap: "var(--spacing-lg)" }}>
                    <div className="user-avatar" style={{ width: "60px", height: "60px", fontSize: "2rem" }}>
                        {worker.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: "var(--spacing-xs)" }}>{worker.name}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)", margin: 0 }}>
                            {worker.skills ? JSON.parse(worker.skills).join(", ") : "No skills listed"}
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>Hourly Rate</p>
                        <p style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "700", color: "var(--primary-color)" }}>
                            ${worker.hourly_rate || 0}/hr
                        </p>
                    </div>
                </div>
            </div>

            {/* Hiring Request Form */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Job Details</h3>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: "var(--spacing-lg)" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Job Title *</label>
                            <input
                                type="text"
                                name="job_title"
                                className="form-input"
                                value={formData.job_title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Kitchen Renovation, Electrical Wiring"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Description *</label>
                            <textarea
                                name="job_description"
                                className="form-textarea"
                                value={formData.job_description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Describe the job in detail..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Location *</label>
                            <input
                                type="text"
                                name="job_location"
                                className="form-input"
                                value={formData.job_location}
                                onChange={handleChange}
                                required
                                placeholder="Address or city"
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--spacing-md)" }}>
                            <div className="form-group">
                                <label className="form-label">Estimated Hours</label>
                                <input
                                    type="number"
                                    name="estimated_hours"
                                    className="form-input"
                                    value={formData.estimated_hours}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.5"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Offered Rate ($/hour)</label>
                                <input
                                    type="number"
                                    name="offered_rate"
                                    className="form-input"
                                    value={formData.offered_rate}
                                    onChange={handleChange}
                                    placeholder={worker.hourly_rate || "0"}
                                    min="0"
                                    step="0.01"
                                />
                                <small style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                                    Worker's rate: ${worker.hourly_rate || 0}/hr
                                </small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    className="form-input"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-xl)" }}>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? "Sending Request..." : "Send Hiring Request"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/worker/${workerId}`)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HireWorker;
