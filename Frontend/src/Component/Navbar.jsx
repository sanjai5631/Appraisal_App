import React from "react";
import { Navbar as BSNavbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <BSNavbar.Brand as={NavLink} to="/home">Employee Portal</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {role === "hr" && <Nav.Link as={NavLink} to="/dashboard/hr">HR Dashboard</Nav.Link>}
            {role === "manager" && <Nav.Link as={NavLink} to="/dashboard/manager">Manager Dashboard</Nav.Link>}
            {role === "employee" && <Nav.Link as={NavLink} to="/employee">Self Appraisal</Nav.Link>}
          </Nav>
          <Nav>
            <NavDropdown title="Account" align="end">
              <NavDropdown.Item as={NavLink} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
