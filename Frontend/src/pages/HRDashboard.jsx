import React from "react";
import DashboardCard from "../Component/DashBoardCard";
import { Row, Col } from "react-bootstrap";
import { FaUserTie, FaTasks, FaRegChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HRDashboard() {
  const navigate = useNavigate();

  const handleCreateEmployee = () => {
    navigate("/dashboard/hr/create-employee");
  };

  return (
    <>
      <h2>HR Dashboard</h2>
      <Row>
        <Col md={4}>
          <DashboardCard
            title="Pending Approvals"
            value="5"
            icon={<FaTasks size={40} />}
          />
        </Col>
        <Col md={4}>
          <DashboardCard
            title="Employees Onboarded"
            value="20"
            icon={<FaUserTie size={40} />}
          />
        </Col>
        <Col md={4}>
          <DashboardCard
            title="Appraisal Reports"
            value="12"
            icon={<FaRegChartBar size={40} />}
          />
        </Col>
      </Row>
    </>
  );
}

export default HRDashboard;
