import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Styles
import "./styles/theme.css";
import "./styles/components.css";

// Components
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WorkerDashboard from "./pages/WorkerDashboard";
import HirerDashboard from "./pages/HirerDashboard";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import BrowseWorkers from "./pages/BrowseWorkers";
import MyRequests from "./pages/MyRequests";
import WorkerRequests from "./pages/WorkerRequests";

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/worker"
          element={
            <ProtectedRoute>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hirer"
          element={
            <ProtectedRoute>
              <HirerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse-workers"
          element={
            <ProtectedRoute>
              <BrowseWorkers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <WorkerRequests />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to login or dashboard based on auth state */}
        <Route
          path="/"
          element={
            isAuthenticated ?
              <Navigate to={`/dashboard/${localStorage.getItem("role")}`} replace /> :
              <Navigate to="/login" replace />
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
