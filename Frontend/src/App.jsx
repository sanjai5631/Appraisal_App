import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RequireAuth from "./Component/RequireAuth";
import Navbar from "./Component/Navbar";
import Login from "./Component/Login";
import HRDashboard from "./pages/HRDashboard";
import ManagerDashboard from "./pages/AdminDashboard";
import EmployeePage from "./pages/EmployeePage";
import "bootstrap/dist/css/bootstrap.min.css";

function AppContent() {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  // Hide navbar only on login/signup pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {isLoggedIn && !hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
       

        {/* HR dashboard */}
        <Route
          path="/dashboard/hr"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <HRDashboard />
            </RequireAuth>
          }
        />

        {/* Manager dashboard */}
        <Route
          path="/dashboard/manager"
          element={
            <RequireAuth allowedRoles={["manager"]}>
              <ManagerDashboard />
            </RequireAuth>
          }
        />

        {/* Employee page */}
        <Route
          path="/employee"
          element={
            <RequireAuth allowedRoles={["employee"]}>
              <EmployeePage />
            </RequireAuth>
          }
        />

        {/* Default redirect after login */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              role === "hr" ? (
                <Navigate to="/dashboard/hr" replace />
              ) : role === "manager" ? (
                <Navigate to="/dashboard/manager" replace />
              ) : (
                <Navigate to="/employee" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
