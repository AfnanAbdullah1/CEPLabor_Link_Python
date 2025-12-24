import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function ReviewForm() {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [worker, setWorker] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ""
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
        fetchRequestDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestId, navigate]);

    async function fetchRequestDetails() {
        try {
            const reqRes = await API.get(`/hiring/requests/${requestId}`);
            setRequest(reqRes.data);

            // Verify this is the hirer's request and it's completed
            if (reqRes.data.hirer_id !== hirerId) {
                setError("You are not authorized to review this request");
                setLoading(false);
                return;
            }

            if (reqRes.data.status !== "completed") {
                setError("You can only review completed jobs");
                setLoading(false);
                return;
            }

            // Fetch worker details
            const workerRes = await API.get(`/users/${reqRes.data.worker_id}`);
            setWorker(workerRes.data);
        } catch (error) {
            console.error("Error fetching request details:", error);
            setError("Failed to load request information");
        } finally {
            setLoading(false);
        }
    }

    function handleRatingChange(rating) {
        setFormData({ ...formData, rating });
    }

    function handleCommentChange(e) {
        setFormData({ ...formData, comment: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const reviewData = {
                worker_id: request.worker_id,
                rating: formData.rating,
                comment: formData.comment || null
            };

            await API.post(`/hiring/requests/${requestId}/review?hirer_id=${hirerId}`, reviewData);

            // Success! Navigate back to my requests
            navigate("/my-requests", {
                state: { message: "Review submitted successfully! Thank you for your feedback." }
            });
        } catch (err) {
            console.error("Error submitting review:", err);
            setError(err.response?.data?.detail || "Failed to submit review. Please try again.");
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

    if (error && !request) {
        return (
            <div className="dashboard-container">
                <div className="empty-state">
                    <span className="empty-icon">⚠️</span>
                    <h3>{error}</h3>
                    <button className="btn btn-primary" onClick={() => navigate("/my-requests")}>
                        Back to My Requests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Submit Review ⭐</h1>
                    <p>Share your experience with {worker?.name}</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate("/my-requests")}>
                    Back to Requests
                </button>
            </div>

            {/* Job Summary Card */}
            <div className="card" style={{ marginBottom: "var(--spacing-xl)" }}>
                <div className="card-header">
                    <h3 className="card-title">Job Details</h3>
                </div>
                <div className="card-body">
                    <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Job Title:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{request?.job_title}</p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Worker:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{worker?.name}</p>
                        </div>
                        <div>
                            <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Location:</strong>
                            <p style={{ margin: "var(--spacing-xs) 0" }}>{request?.job_location}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Form */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Your Review</h3>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: "var(--spacing-lg)" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Rating *</label>
                            <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        style={{
                                            fontSize: "3rem",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            color: star <= formData.rating ? "#fbbf24" : "#d1d5db",
                                            transition: "all var(--transition-base)"
                                        }}
                                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <p style={{ marginTop: "var(--spacing-sm)", color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                                Rating: {formData.rating} out of 5 stars
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Comment (Optional)</label>
                            <textarea
                                name="comment"
                                className="form-textarea"
                                value={formData.comment}
                                onChange={handleCommentChange}
                                rows="6"
                                placeholder="Share your experience working with this professional..."
                            />
                            <small style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                                Help other hirers by describing the quality of work, professionalism, and overall experience.
                            </small>
                        </div>

                        <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-xl)" }}>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? "Submitting Review..." : "Submit Review"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/my-requests")}
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

export default ReviewForm;
