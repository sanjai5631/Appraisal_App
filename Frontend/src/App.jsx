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
import HRDashboard from "./pages/hr/HRDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AddEmployee from "./pages/employee/AddEmployee";
import ViewEmployees from "./pages/employee/ViewEmployees";
import "bootstrap/dist/css/bootstrap.min.css";
import AppraisalCycleForm from "./pages/cycles/AppraisalCycleForm";
import AddCycle from "./pages/cycles/AddCycle";
import FinancialYearPage from "./pages/cycles/FinancialYear";
import SelfAppraisalList from "./pages/selfAppraisal/selfAppraisalList";
import SelfAppraisalForm from "./pages/selfAppraisal/SelfAppraisalForm";
import UnitAppraisal from "./pages/manager/UnitAppraisal";
import ViewAppraisal from "./pages/hr/ViewAppraisal";
import Profile from "./pages/employee/Profile";

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
        <Route
          path="/hr/view-appraisal"
          element={
            <RequireAuth allowedRoles={["hr"]}>
              <ViewAppraisal />
            </RequireAuth>
          }
        />
        <Route
          path="/create-employee"
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
          }
        />
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
        <Route
          path="/dashboard/unit-appraisal"
          element={
            <RequireAuth allowedRoles={["manager"]}>
              <UnitAppraisal />
            </RequireAuth>
          }
        />
        <Route
          path="/manager-review"
          element={
            <RequireAuth allowedRoles={["manager"]}>
              <SelfAppraisalForm />
            </RequireAuth>
          }
        />

        {/* Employee pages */}
        <Route
          path="/self-appraisal-list"
          element={
            <RequireAuth allowedRoles={["employee"]}>
              <SelfAppraisalList />
            </RequireAuth>
          }
        />
       <Route
            path="/self-appraisal-form"
            element={
              <RequireAuth allowedRoles={["employee","manager","hr"]}>
                <SelfAppraisalForm />
              </RequireAuth>
            }
          />

          <Route
              path="/profile"
              element={
                <RequireAuth allowedRoles={["hr", "manager", "employee"]}>
                  <Profile />
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
                <Navigate to="/self-appraisal-list" replace />
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
