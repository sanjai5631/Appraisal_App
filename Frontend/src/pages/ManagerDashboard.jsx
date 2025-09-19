import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
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

  // Fetch data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Example API calls, replace with your actual endpoints
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
    <Container fluid className="p-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <h2 className="mb-4">Manager Dashboard</h2>

      {/* Dashboard Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6}>
          <Card className="shadow-sm text-center p-3">
            <FaUserTie size={40} color="#0d6efd" />
            <h5 className="mt-2">Total Employees</h5>
            <h3>{stats.totalEmployees}</h3>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm text-center p-3">
            <FaTasks size={40} color="#ffc107" />
            <h5 className="mt-2">Pending Appraisals</h5>
            <h3>{stats.pendingAppraisals}</h3>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm text-center p-3">
            <FaRegChartBar size={40} color="#198754" />
            <h5 className="mt-2">Completed Appraisals</h5>
            <h3>{stats.completedAppraisals}</h3>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm text-center p-3">
            <FaFileAlt size={40} color="#6c757d" />
            <h5 className="mt-2">Team Reports</h5>
            <h3>{stats.teamReports}</h3>
          </Card>
        </Col>
      </Row>

      {/* Graph Section */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm p-3">
            <h5 className="mb-3">Appraisals by Month</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" fill="#ffc107" name="Pending" />
                <Bar dataKey="completed" fill="#198754" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Manager Actions */}
      <Row className="mt-4">
        <Col md={3} sm={6} className="mb-2">
          <Button variant="primary" className="w-100 py-2">
            View Team Reports
          </Button>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Button variant="success" className="w-100 py-2">
            Approve Appraisals
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerDashboard;
