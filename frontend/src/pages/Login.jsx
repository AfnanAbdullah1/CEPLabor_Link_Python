import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if there's a success message from signup
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the state after showing the message
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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

        try {
            const res = await API.post("/auth/login", formData);

            // Store token and user info
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("user_id", res.data.user_id);
            localStorage.setItem("role", res.data.role);

            // Fetch user details to get the name
            try {
                const userRes = await API.get(`/users/${res.data.user_id}`);
                localStorage.setItem("name", userRes.data.name);
            } catch (err) {
                console.error("Error fetching user details:", err);
            }

            // Notify App component about auth change
            window.dispatchEvent(new Event("authChange"));

            // Redirect to appropriate dashboard
            navigate(`/dashboard/${res.data.role}`);
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.detail || "Login failed. Please try again.");
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
            <div className="card" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="card-header">
                    <h2 className="card-title">Welcome Back</h2>
                    <p className="card-subtitle">Login to your LaborLink account</p>
                </div>

                <div className="card-body">
                    {successMessage && (
                        <div className="alert alert-success">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
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
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div style={{
                        marginTop: "var(--spacing-lg)",
                        textAlign: "center",
                        color: "var(--text-muted)"
                    }}>
                        Don't have an account?{" "}
                        <Link to="/signup" style={{
                            color: "var(--primary)",
                            textDecoration: "none",
                            fontWeight: "500"
                        }}>
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
