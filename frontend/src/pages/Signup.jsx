import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "worker",
        location: "",
        experience: "",
        skills: "",
        hourly_rate: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || null,
                role: formData.role,
                location: formData.location || null,
                experience: formData.experience ? parseInt(formData.experience) : 0,
                skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : null,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null
            };

            const res = await API.post("/auth/signup", signupData);

            // Don't store token - redirect to login instead
            // Show success message and redirect to login page
            navigate("/login", {
                state: {
                    message: "Account created successfully! Please login to continue."
                }
            });
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.response?.data?.detail || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard-container fade-in" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "var(--spacing-xl)"
        }}>
            <div className="card" style={{ maxWidth: "600px", width: "100%" }}>
                <div className="card-header">
                    <h2 className="card-title">Create Account</h2>
                    <p className="card-subtitle">Join LaborLink today</p>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">I am a *</label>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "var(--spacing-md)",
                                marginTop: "var(--spacing-sm)"
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "worker" })}
                                    style={{
                                        padding: "var(--spacing-lg)",
                                        border: formData.role === "worker"
                                            ? "2px solid var(--primary)"
                                            : "2px solid var(--border-color)",
                                        borderRadius: "var(--border-radius)",
                                        backgroundColor: formData.role === "worker"
                                            ? "var(--primary-bg)"
                                            : "var(--bg-card)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "var(--spacing-sm)"
                                    }}
                                >
                                    <span style={{ fontSize: "2rem" }}>👷</span>
                                    <strong style={{ color: "var(--text-primary)", fontSize: "var(--font-size-base)" }}>
                                        Worker
                                    </strong>
                                    <span style={{
                                        fontSize: "var(--font-size-sm)",
                                        color: "var(--text-muted)",
                                        textAlign: "center"
                                    }}>
                                        Looking for jobs
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "hirer" })}
                                    style={{
                                        padding: "var(--spacing-lg)",
                                        border: formData.role === "hirer"
                                            ? "2px solid var(--primary)"
                                            : "2px solid var(--border-color)",
                                        borderRadius: "var(--border-radius)",
                                        backgroundColor: formData.role === "hirer"
                                            ? "var(--primary-bg)"
                                            : "var(--bg-card)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "var(--spacing-sm)"
                                    }}
                                >
                                    <span style={{ fontSize: "2rem" }}>💼</span>
                                    <strong style={{ color: "var(--text-primary)", fontSize: "var(--font-size-base)" }}>
                                        Hirer
                                    </strong>
                                    <span style={{
                                        fontSize: "var(--font-size-sm)",
                                        color: "var(--text-muted)",
                                        textAlign: "center"
                                    }}>
                                        Looking to hire
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password *</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                placeholder="At least 6 characters"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Re-enter password"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+92 300 1234567"
                            />
                        </div>



                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-input"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, Country"
                            />
                        </div>

                        {formData.role === "worker" && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        className="form-input"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="e.g. Mason, Electrician, Plumber"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        className="form-input"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        name="hourly_rate"
                                        className="form-input"
                                        value={formData.hourly_rate}
                                        onChange={handleChange}
                                        placeholder="15"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div style={{
                        marginTop: "var(--spacing-lg)",
                        textAlign: "center",
                        color: "var(--text-muted)"
                    }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{
                            color: "var(--primary)",
                            textDecoration: "none",
                            fontWeight: "500"
                        }}>
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
