import React from "react";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user info from localStorage
  const userName = localStorage.getItem("name") || "User";
  const userRole = role || localStorage.getItem("role") || "Employee";
  const userEmail = localStorage.getItem("email") || "user@example.com";
  const userEmpCode = localStorage.getItem("empCode") || "EMP001";
  const avatarUrl = localStorage.getItem("avatarUrl"); // optional avatar stored on login

  // Role-based badge colors
  const roleColors = {
    hr: "danger",
    manager: "primary",
    employee: "success",
  };
  const badgeColor = roleColors[userRole.toLowerCase()] || "secondary";

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={NavLink} to="/home">
          Appraisal System
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {role === "hr" && (
              <>
                <Nav.Link as={NavLink} to="/dashboard/hr">
                  HR Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/view-employees">
                  Employees
                </Nav.Link>
                <Nav.Link as={NavLink} to="/appraisal-cycle">
                  Appraisal Cycle
                </Nav.Link>
                <Nav.Link as={NavLink} to="/financial-year">
                  Financial Year
                </Nav.Link>
              </>
            )}

            {role === "manager" && (
              <>
                <Nav.Link as={NavLink} to="/dashboard/manager">
                  Manager Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/dashboard/unit-appraisal">
                  My Unit Appraisal
                </Nav.Link>
              </>
            )}

            {role === "employee" && (
              <Nav.Link as={NavLink} to="/self-appraisal-list">
                Self Appraisal
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                roundedCircle
                width={30}
                height={30}
                className="me-2"
                alt="User Avatar"
              />
            ) : (
              <FaUserCircle size={28} className="text-light me-2" />
            )}
            <span className="text-light me-2">{userName}</span>
            <Badge bg={badgeColor} className="me-3 text-uppercase">
              {userRole}
            </Badge>

            <NavDropdown title="Account" align="end">
              {/* ✅ Profile Details inside dropdown */}
              <div className="px-3 py-2" style={{ minWidth: "220px" }}>
                <div className="d-flex align-items-center mb-2">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      roundedCircle
                      width={40}
                      height={40}
                      alt="User Avatar"
                      className="me-2"
                    />
                  ) : (
                    <FaUserCircle size={40} className="text-secondary me-2" />
                  )}
                  <div>
                    <strong>{userName}</strong>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {userEmail}
                    </div>
                  </div>
                </div>
                <div>
                  <small className="text-muted">Emp Code:</small>{" "}
                  <strong>{userEmpCode}</strong>
                </div>
                <div>
                  <small className="text-muted">Role:</small>{" "}
                  <Badge bg={badgeColor}>{userRole}</Badge>
                </div>
              </div>

              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate("/profile")}>View Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
