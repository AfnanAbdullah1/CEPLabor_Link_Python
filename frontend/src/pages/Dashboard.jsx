import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role-specific dashboard
    const role = localStorage.getItem("role");

    if (role === "worker") {
      navigate("/dashboard/worker", { replace: true });
    } else if (role === "hirer") {
      navigate("/dashboard/hirer", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="spinner-lg"></div>
    </div>
  );
}

export default Dashboard;
