import React from "react";
import Sidebar from "../Component/Sidebar";
import DashboardCard from "../Component/DashBoardCard";
import { Row, Col, Table } from "react-bootstrap";
import { FaUsers, FaClipboardList, FaChartLine } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance Score",
        data: [80, 85, 88, 90, 87, 92],
        fill: false,
        borderColor: "#0d6efd",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Appraisal Performance Trend" },
    },
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "100%", padding: "2rem" }}>
        <h2>Admin Dashboard</h2>

        {/* KPI Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <DashboardCard
              title="Total Employees"
              value="120"
              icon={<FaUsers />}
              color="#1abc9c"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="Active Appraisals"
              value="8"
              icon={<FaClipboardList />}
              color="#f39c12"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="Average Performance"
              value="87%"
              icon={<FaChartLine />}
              color="#3498db"
            />
          </Col>
        </Row>

        {/* Performance Chart */}
        <Row className="mb-4">
          <Col md={12}>
            <Line data={lineData} options={lineOptions} />
          </Col>
        </Row>

        {/* Recent Activities Table */}
        <Row>
          <Col md={12}>
            <h4>Recent Appraisal Activities</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Appraisal Cycle</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>Q1 2025</td>
                  <td>Completed</td>
                  <td>90%</td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>Q1 2025</td>
                  <td>Pending</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Robert Brown</td>
                  <td>Q1 2025</td>
                  <td>Completed</td>
                  <td>85%</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AdminDashboard;
