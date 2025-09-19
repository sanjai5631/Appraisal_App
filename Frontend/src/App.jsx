
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
import ManagerDashboard from "./pages/ManagerDashboard";
import AddEmployee from "./pages/employee/AddEmployee";
import ViewEmployees from "./pages/employee/ViewEmployees"; // <-- corrected import
import EmployeePage from "./pages/EmployeePage";
import "bootstrap/dist/css/bootstrap.min.css";
import AppraisalCycleForm from "./pages/cycles/AppraisalCycleForm";
import AddCycle from "./pages/cycles/AddCycle";
import FinancialYearPage from "./pages/cycles/FinancialYear";

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

        {/* HR employee management */}
        <Route
          path="/add-employee"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <AddEmployee />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-employee/:employeeId"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <AddEmployee />
            </RequireAuth>
          }
        />
        <Route
          path="/view-employees"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <ViewEmployees />
            </RequireAuth>
          }
        />

        <Route
          path="/appraisal-cycle"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <AppraisalCycleForm />
            </RequireAuth>
          }
        />
        <Route
          path="/add-cycle"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <AddCycle />
            </RequireAuth>
          } />

        <Route
          path="/financial-year"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <FinancialYearPage />
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
