// src/components/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children, allowedRoles }) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but role is not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    switch (role) {
      case "hr":
        return <Navigate to="/dashboard/hr" replace />;
      case "manager":
        return <Navigate to="/dashboard/manager" replace />;
      case "employee":
        return <Navigate to="/employee" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}
