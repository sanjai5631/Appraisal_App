// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Menu</h3>

      <NavLink
        to="/dashboard/hr"
        className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
      >
        Dashboard
      </NavLink>

      {/* Employees link now goes directly to Create Employee page */}
      <NavLink
        to="/view-employees"
        className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
      >
        Employees
      </NavLink>

      <NavLink
        to="/cycles"
        className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
      >
        Appraisal Cycles
      </NavLink>

      <NavLink
        to="/reports"
        className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
      >
        Reports
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
      >
        Settings
      </NavLink>
    </div>
  );
}

export default Sidebar;
