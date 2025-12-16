import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function BrowseWorkers() {
    const [workers, setWorkers] = useState([]);
    const [filters, setFilters] = useState({
        skill: "",
        location: "",
        min_rate: "",
        max_rate: "",
        min_rating: "",
        is_available: true
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "hirer") {
            navigate("/login");
            return;
        }
        fetchWorkers();
    }, [navigate]);

    async function fetchWorkers() {
        try {
            const params = new URLSearchParams();
            if (filters.skill) params.append("skill", filters.skill);
            if (filters.location) params.append("location", filters.location);
            if (filters.min_rate) params.append("min_rate", filters.min_rate);
            if (filters.max_rate) params.append("max_rate", filters.max_rate);
            if (filters.min_rating) params.append("min_rating", filters.min_rating);
            if (filters.is_available) params.append("is_available", "true");

            const res = await API.get(`/workers/search?${params.toString()}`);
            setWorkers(res.data);
        } catch (error) {
            console.error("Error fetching workers:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleFilterChange(e) {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === "checkbox" ? checked : value
        });
    }

    function applyFilters(e) {
        e.preventDefault();
        setLoading(true);
        fetchWorkers();
    }

    function clearFilters() {
        setFilters({
            skill: "",
            location: "",
            min_rate: "",
            max_rate: "",
            min_rating: "",
            is_available: true
        });
        setLoading(true);
        fetchWorkers();
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
                <h1>Browse Workers 🔍</h1>
                <p>Find skilled professionals for your projects</p>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: "var(--spacing-2xl)" }}>
                <div className="card-header">
                    <h3 className="card-title">Filter Workers</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={applyFilters}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--spacing-md)" }}>
                            <div className="form-group">
                                <label className="form-label">Skill</label>
                                <input
                                    type="text"
                                    name="skill"
                                    className="form-input"
                                    placeholder="e.g. Mason, Electrician"
                                    value={filters.skill}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-input"
                                    placeholder="City, Country"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Min Rate ($)</label>
                                <input
                                    type="number"
                                    name="min_rate"
                                    className="form-input"
                                    placeholder="0"
                                    value={filters.min_rate}
                                    onChange={handleFilterChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Max Rate ($)</label>
                                <input
                                    type="number"
                                    name="max_rate"
                                    className="form-input"
                                    placeholder="100"
                                    value={filters.max_rate}
                                    onChange={handleFilterChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Min Rating</label>
                                <input
                                    type="number"
                                    name="min_rating"
                                    className="form-input"
                                    placeholder="0"
                                    value={filters.min_rating}
                                    onChange={handleFilterChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={filters.is_available}
                                        onChange={handleFilterChange}
                                    />
                                    <span className="form-label" style={{ margin: 0 }}>Available only</span>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
                            <button type="submit" className="btn btn-primary">Apply Filters</button>
                            <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Workers Grid */}
            <div className="section">
                <h2>Available Workers ({workers.length})</h2>

                {workers.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">👷</span>
                        <h3>No workers found</h3>
                        <p>Try adjusting your filters to see more results</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-lg)" }}>
                        {workers.map((worker) => (
                            <div key={worker.id} className="card">
                                <div style={{ textAlign: "center", marginBottom: "var(--spacing-md)" }}>
                                    <div className="user-avatar" style={{ width: "80px", height: "80px", fontSize: "2rem", margin: "0 auto var(--spacing-md)" }}>
                                        {worker.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 style={{ marginBottom: "var(--spacing-xs)" }}>{worker.name}</h3>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--spacing-xs)", marginBottom: "var(--spacing-sm)" }}>
                                        <span style={{ color: "#fbbf24" }}>⭐</span>
                                        <span style={{ fontWeight: "600" }}>{worker.rating || 0}</span>
                                        <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                                            ({worker.total_jobs || 0} jobs)
                                        </span>
                                    </div>
                                    <span className={`badge ${worker.is_available ? "badge-success" : "badge-secondary"}`}>
                                        {worker.is_available ? "Available" : "Unavailable"}
                                    </span>
                                </div>

                                <div style={{ marginBottom: "var(--spacing-md)" }}>
                                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Skills:</strong>
                                    <p style={{ margin: "var(--spacing-xs) 0", fontSize: "var(--font-size-sm)" }}>
                                        {worker.skills ? JSON.parse(worker.skills).join(", ") : "Not specified"}
                                    </p>
                                </div>

                                <div style={{ marginBottom: "var(--spacing-md)" }}>
                                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Location:</strong>
                                    <p style={{ margin: "var(--spacing-xs) 0", fontSize: "var(--font-size-sm)" }}>
                                        {worker.location || "Not specified"}
                                    </p>
                                </div>

                                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                                    <strong style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Hourly Rate:</strong>
                                    <p style={{ margin: "var(--spacing-xs) 0", fontWeight: "700", color: "var(--primary-color)", fontSize: "var(--font-size-lg)" }}>
                                        ${worker.hourly_rate || 0}/hour
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => navigate(`/worker/${worker.id}`)}
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => navigate(`/hire/${worker.id}`)}
                                    >
                                        Hire
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrowseWorkers;
