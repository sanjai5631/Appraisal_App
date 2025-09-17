import React from "react";
import Sidebar from "../Component/Sidebar";
import DashboardCard from "../Component/DashBoardCard";
import { Container, Row, Col } from "react-bootstrap";
import { FaUserTie, FaTasks, FaRegChartBar } from "react-icons/fa";

function HRDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "100%", padding: "2rem" }}>
        <h2>HR Dashboard</h2>
        <Row>
          <Col md={4}>
            <DashboardCard title="Pending Approvals" value="5" icon={<FaTasks size={40} />} />
          </Col>
          <Col md={4}>
            <DashboardCard title="Employees onboarded" value="20" icon={<FaUserTie size={40} />} />
          </Col>
          <Col md={4}>
            <DashboardCard title="Appraisal Reports" value="12" icon={<FaRegChartBar size={40} />} />
          </Col>
        </Row>
        {/* Charts and tables can go here */}
      </div>
    </div>
  );
}

export default HRDashboard;
