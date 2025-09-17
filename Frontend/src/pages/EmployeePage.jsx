import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function EmployeePage() {
  const { role } = useAuth();

  // Redirect or hide if not employee
  if (role !== "employee") return <div>You do not have access to this page.</div>;

  // Example appraisal KPIs (you can fetch from API)
  const [appraisalData, setAppraisalData] = useState([]);
  
  useEffect(() => {
    const mockData = [
      { kpi: "Quality of Work", weight: 25, score: "" },
      { kpi: "Timeliness", weight: 20, score: "" },
      { kpi: "Team Collaboration", weight: 15, score: "" },
      { kpi: "Problem Solving", weight: 20, score: "" },
      { kpi: "Learning & Development", weight: 20, score: "" },
    ];
    setAppraisalData(mockData);
  }, []);

  const handleChange = (index, value) => {
    const updated = [...appraisalData];
    updated[index].score = value;
    setAppraisalData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to submit appraisal
    alert("Self-appraisal submitted successfully!");
  };

  // Example past appraisals (can fetch from API)
  const pastAppraisals = [
    { cycle: "Q1 2025", overallScore: "88%", status: "Reviewed" },
    { cycle: "Q4 2024", overallScore: "82%", status: "Reviewed" },
  ];

  return (
    <Container fluid style={{ marginTop: "2rem" }}>
      <h2>Self-Appraisal Form</h2>

      <Form onSubmit={handleSubmit}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>KPI</th>
              <th>Weight (%)</th>
              <th>Your Score (0-5)</th>
            </tr>
          </thead>
          <tbody>
            {appraisalData.map((item, index) => (
              <tr key={index}>
                <td>{item.kpi}</td>
                <td>{item.weight}</td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={item.score}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button type="submit" variant="primary">Submit Appraisal</Button>
      </Form>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Past Appraisals</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Cycle</th>
            <th>Overall Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pastAppraisals.map((item, index) => (
            <tr key={index}>
              <td>{item.cycle}</td>
              <td>{item.overallScore}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default EmployeePage;
