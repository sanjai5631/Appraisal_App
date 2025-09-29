// src/pages/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { Spinner, Badge, Row, Col, Accordion } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import Swal from "sweetalert2";
import CardWrapper from "../../Component/CardWrapper";

function Profile() {
  const { token: contextToken, employeeId: contextEmpId } = useAuth();
  const token = contextToken || localStorage.getItem("token");
  const empId = contextEmpId || localStorage.getItem("employeeId");

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empId || !token) {
      Swal.fire("Unauthorized", "Please log in again.", "error");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7098/api/Employee/GetEmployee",
          {
            params: { EmployeeId: empId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEmployee(res.data.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        Swal.fire(
          "Error",
          err.response?.status === 401
            ? "Unauthorized. Please log in again."
            : "Failed to fetch employee details.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [empId, token]);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (!employee) return <p className="text-center mt-5">No data available.</p>;

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");

  return (
    <div className="container-fluid mt-5">
      <Row>
        <Col lg={4} md={5}>
          {/* Profile Card */}
          <CardWrapper variant="default" hover>
            <div className="text-center p-3">
              <div className="position-relative mb-3">
                {employee.profilePicture ? (
                  <img
                    src={employee.profilePicture}
                    alt="Profile"
                    className="rounded-circle"
                    width={120}
                    height={120}
                  />
                ) : (
                  <FaUserCircle size={120} className="text-secondary" />
                )}
              </div>
              <h4 className="mb-1">{employee.name}</h4>
              <p className="text-muted mb-1">
                <FaEnvelope className="me-1" /> {employee.email}
              </p>
              <Badge bg={employee.isActive ? "success" : "secondary"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardWrapper>
        </Col>

        <Col lg={8} md={7}>
          {/* Detailed Info Accordion */}
          <CardWrapper variant="default" hover>
            <h4 className="mb-3">Employee Details</h4>
            <Accordion defaultActiveKey="0">
              {/* Basic Info */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>Basic Information</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={6}>
                      <p><FaIdBadge className="me-2" /> <strong>Employee Code:</strong> {employee.empCode}</p>
                      <p><FaBuilding className="me-2" /> <strong>Department:</strong> {employee.department}</p>
                      <p><strong>Unit:</strong> {employee.unit}</p>
                      <p><strong>Role:</strong> {employee.role}</p>
                      <p><FaCalendarAlt className="me-2" /> <strong>Joining Date:</strong> {formatDate(employee.joiningDate)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Gender:</strong> {employee.gender}</p>
                      <p><strong>Religion:</strong> {employee.religion}</p>
                      <p><strong>Qualification:</strong> {employee.qualification}</p>
                      <p><FaCalendarAlt className="me-2" /> <strong>DOB:</strong> {formatDate(employee.dob)}</p>
                      <p><strong>Status:</strong> {employee.isActive ? "Active" : "Inactive"}</p>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              {/* Contact Info */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>Contact Information</Accordion.Header>
                <Accordion.Body>
                  <p><FaPhone className="me-2" /> <strong>Phone:</strong> {employee.phone || "—"}</p>
                  <p><FaEnvelope className="me-2" /> <strong>Email:</strong> {employee.email || "—"}</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </CardWrapper>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
