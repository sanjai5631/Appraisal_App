import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <NavLink to="/dashboard" className="sidebar-link">
        Dashboard
      </NavLink>
      <NavLink to="/employees" className="sidebar-link">
        Employees
      </NavLink>
      <NavLink to="/cycles" className="sidebar-link">
        Appraisal Cycles
      </NavLink>
      <NavLink to="/reports" className="sidebar-link">
        Reports
      </NavLink>
      <NavLink to="/settings" className="sidebar-link">
        Settings
      </NavLink>
    </div>
  );
}

export default Sidebar;
