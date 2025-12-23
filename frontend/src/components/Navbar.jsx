import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("name");
    const userRole = localStorage.getItem("role");

    if (userId) {
      setUser({ id: userId, name: userName, role: userRole });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    // Notify App component about auth change
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (!user) {
    return null; // Don't show navbar if not logged in
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={`/dashboard/${user.role}`} className="navbar-brand">
          <span className="brand-icon">🔗</span>
          <span className="brand-text">LaborLink</span>
        </Link>

        <div className="navbar-menu">
          {user.role === "worker" ? (
            <>
              <Link to="/dashboard/worker" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                My Profile
              </Link>
              <Link to="/requests" className="nav-link">
                Job Requests
              </Link>
              <Link to="/chat" className="nav-link">
                Messages
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/hirer" className="nav-link">
                Dashboard
              </Link>
              <Link to="/browse-workers" className="nav-link">
                Browse Workers
              </Link>
              <Link to="/my-requests" className="nav-link">
                My Requests
              </Link>
              <Link to="/chat" className="nav-link">
                Messages
              </Link>
            </>
          )}

          <div className="navbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user.name}</span>
            <span className="dropdown-arrow">▼</span>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <strong>{user.name}</strong>
                  <div className="user-role-badge">
                    {user.role === "worker" ? "👷 Worker" : "💼 Hirer"}
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  ⚙️ Settings
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
