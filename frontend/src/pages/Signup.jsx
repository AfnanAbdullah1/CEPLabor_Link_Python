import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../styles/auth.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker", // Default role
    phone: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selectRole(role) {
    setForm({ ...form, role });
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/register", form);
      console.log("Signup successful:", response.data);
      
      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1 className="text-gradient">Join LaborLink</h1>
          <p>Create your account and get started</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I am a *</label>
            <div className="role-selector">
              <div
                className={`role-card ${form.role === "worker" ? "active" : ""}`}
                onClick={() => selectRole("worker")}
              >
                <div className="role-icon">👷</div>
                <h3>Worker</h3>
                <p>Looking for work opportunities</p>
              </div>
              <div
                className={`role-card ${form.role === "hirer" ? "active" : ""}`}
                onClick={() => selectRole("hirer")}
              >
                <div className="role-icon">💼</div>
                <h3>Hirer</h3>
                <p>Looking to hire workers</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="form-input"
              value={form.name}
              onChange={updateForm}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              className="form-input"
              value={form.email}
              onChange={updateForm}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              className="form-input"
              value={form.phone}
              onChange={updateForm}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              name="location"
              type="text"
              placeholder="City, Country"
              className="form-input"
              value={form.location}
              onChange={updateForm}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              className="form-input"
              value={form.password}
              onChange={updateForm}
              required
              minLength="6"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner spinner-sm"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
