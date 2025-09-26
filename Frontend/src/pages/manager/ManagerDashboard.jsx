import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, ProgressBar } from "react-bootstrap";
import { FaTasks, FaRegChartBar, FaFileAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import Swal from "sweetalert2";

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingAppraisals: 0,
    completedAppraisals: 0,
    teamReports: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employeeId");

  const fetchDashboardData = async () => {
    if (!employeeId) {
      setLoading(false);
      Swal.fire("Error", "Employee ID not found. Please login again.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `https://localhost:7098/api/SelfAppraisal/GetEmployeeById?employeeId=${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(res.data.data) ? res.data.data : res.data?.data ? [res.data.data] : [];

      const completedAppraisals = data.filter(a => a.status === "Completed").length;
      const pendingAppraisals = data.filter(a => a.status !== "Completed").length;

      setStats({
        completedAppraisals,
        pendingAppraisals,
        teamReports: data.length,
      });

      const barData = data.map(a => ({
        employeeName: a.employeeName,
        completed: a.status === "Completed" ? 1 : 0,
        pending: a.status !== "Completed" ? 1 : 0,
      }));
      setChartData(barData);

      setStatusData([
        { name: "Completed", value: completedAppraisals },
        { name: "Pending", value: pendingAppraisals },
      ]);

    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.status === 404 ? "Employee not found" : "Failed to fetch dashboard data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [employeeId]);

  const COLORS = ["#28a745", "#ffc107"];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow text-center py-3">
            <FaTasks size={30} className="text-warning mb-2" />
            <Card.Body>
              <Card.Title>Pending Appraisals</Card.Title>
              <h3>{stats.pendingAppraisals}</h3>
              <ProgressBar now={(stats.pendingAppraisals / stats.teamReports) * 100 || 0} variant="warning" className="mt-2"/>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow text-center py-3">
            <FaRegChartBar size={30} className="text-success mb-2" />
            <Card.Body>
              <Card.Title>Completed Appraisals</Card.Title>
              <h3>{stats.completedAppraisals}</h3>
              <ProgressBar now={(stats.completedAppraisals / stats.teamReports) * 100 || 0} variant="success" className="mt-2"/>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow text-center py-3">
            <FaFileAlt size={30} className="text-danger mb-2" />
            <Card.Body>
              <Card.Title>Team Reports</Card.Title>
              <h3>{stats.teamReports}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow">
            <Card.Header className="bg-light">
              <h5><FaRegChartBar className="me-2"/>Appraisal Completion</h5>
            </Card.Header>
            <Card.Body style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="employeeName"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="completed" fill="#28a745"/>
                  <Bar dataKey="pending" fill="#ffc107"/>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow">
            <Card.Header className="bg-light">
              <h5>Status Distribution</h5>
            </Card.Header>
            <Card.Body style={{ height: 350 }} className="d-flex justify-content-center align-items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerDashboard;
