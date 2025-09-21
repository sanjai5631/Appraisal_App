import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaUserTie, FaTasks, FaRegChartBar, FaFileAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingAppraisals: 0,
    completedAppraisals: 0,
    teamReports: 0,
  });
  const [chartData, setChartData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const employeesRes = await axios.get("https://localhost:7098/api/Employee/Stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const chartRes = await axios.get("https://localhost:7098/api/Employee/AppraisalChart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setStats({
        totalEmployees: employeesRes.data.totalEmployees,
        pendingAppraisals: employeesRes.data.pendingAppraisals,
        completedAppraisals: employeesRes.data.completedAppraisals,
        teamReports: employeesRes.data.teamReports,
      });

      setChartData(chartRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-0 text-center py-3">
            <FaUserTie size={30} className="text-primary mb-2" />
            <Card.Body>
              <Card.Title>Total Employees</Card.Title>
              <h3>{stats.totalEmployees}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-0 text-center py-3">
            <FaTasks size={30} className="text-warning mb-2" />
            <Card.Body>
              <Card.Title>Pending Appraisals</Card.Title>
              <h3>{stats.pendingAppraisals}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-0 text-center py-3">
            <FaRegChartBar size={30} className="text-success mb-2" />
            <Card.Body>
              <Card.Title>Completed Appraisals</Card.Title>
              <h3>{stats.completedAppraisals}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-0 text-center py-3">
            <FaFileAlt size={30} className="text-danger mb-2" />
            <Card.Body>
              <Card.Title>Team Reports</Card.Title>
              <h3>{stats.teamReports}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bar Chart */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0"><FaRegChartBar className="me-2" />Appraisal Completion Chart</h5>
            </Card.Header>
            <Card.Body style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="employeeName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#28a745" />
                  <Bar dataKey="pending" fill="#ffc107" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerDashboard;
