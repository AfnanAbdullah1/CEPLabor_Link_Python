import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    experience: "",
    hourly_rate: "",
    skills: "",
    is_available: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUserProfile(userId);
  }, [navigate]);

  async function fetchUserProfile(userId) {
    try {
      const res = await API.get(`/users/${userId}`);
      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        experience: res.data.experience || "",
        hourly_rate: res.data.hourly_rate || "",
        skills: res.data.skills ? JSON.parse(res.data.skills).join(", ") : "",
        is_available: res.data.is_available !== false
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const userId = localStorage.getItem("user_id");
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
        is_available: formData.is_available
      };

      await API.put(`/users/${userId}/update`, updateData);
      setMessage("Profile updated successfully!");
      setEditing(false);

      // Refresh profile
      fetchUserProfile(userId);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="card-title">Profile Information</h3>
            <p className="card-subtitle">
              Role: <span className="badge badge-primary">{user?.role}</span>
            </p>
          </div>
          {!editing && (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="card-body">
          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
                <small style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                  Email cannot be changed
                </small>
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

              {user?.role === "worker" && (
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
                    <label className="form-label">Experience</label>
                    <textarea
                      name="experience"
                      className="form-textarea"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Describe your work experience..."
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

                  <div className="form-group">
                    <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                      />
                      <span className="form-label" style={{ margin: 0 }}>Available for work</span>
                    </label>
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-xl)" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Name:</strong>
                <p style={{ margin: "var(--spacing-xs) 0" }}>{user?.name}</p>
              </div>
              <div>
                <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Email:</strong>
                <p style={{ margin: "var(--spacing-xs) 0" }}>{user?.email}</p>
              </div>
              <div>
                <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Phone:</strong>
                <p style={{ margin: "var(--spacing-xs) 0" }}>{user?.phone || "Not provided"}</p>
              </div>
              <div>
                <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Location:</strong>
                <p style={{ margin: "var(--spacing-xs) 0" }}>{user?.location || "Not provided"}</p>
              </div>

              {user?.role === "worker" && (
                <>
                  <div>
                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Skills:</strong>
                    <p style={{ margin: "var(--spacing-xs) 0" }}>
                      {user?.skills ? JSON.parse(user.skills).join(", ") : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Experience:</strong>
                    <p style={{ margin: "var(--spacing-xs) 0" }}>{user?.experience || "Not provided"}</p>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Hourly Rate:</strong>
                    <p style={{ margin: "var(--spacing-xs) 0" }}>
                      ${user?.hourly_rate || "0"}/hour
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Status:</strong>
                    <p style={{ margin: "var(--spacing-xs) 0" }}>
                      <span className={`badge ${user?.is_available ? "badge-success" : "badge-secondary"}`}>
                        {user?.is_available ? "Available" : "Unavailable"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Rating:</strong>
                    <p style={{ margin: "var(--spacing-xs) 0" }}>{user?.rating || 0} ⭐ ({user?.total_jobs || 0} jobs completed)</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
