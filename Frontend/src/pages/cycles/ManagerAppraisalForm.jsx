// src/pages/appraisal/ManagerAppraisalForm.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const ManagerAppraisalForm = ({ managerId }) => {
  const [employees, setEmployees] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [kpis, setKpis] = useState([]);

  // Fetch employees and cycles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get("https://localhost:7098/api/Employee/GetAllEmployees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmployees(empRes.data);

        const cycleRes = await axios.get("https://localhost:7098/api/Cycle/GetAllCycles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCycles(cycleRes.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch employees or cycles", "error");
      }
    };
    fetchData();
  }, []);

  // Fetch appraisal form when employee & cycle selected
  useEffect(() => {
    if (!selectedEmployeeId || !selectedCycleId) return;
    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7098/api/Appraisal/GetCurrentForm?employeeId=${selectedEmployeeId}&cycleId=${selectedCycleId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setKpis(res.data.data?.kpiResponses || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch appraisal form", "error");
      }
    };
    fetchForm();
  }, [selectedEmployeeId, selectedCycleId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeId: selectedEmployeeId,
      cycleId: selectedCycleId,
      status: "Reviewed",
      kpiResponses: kpis.map((kpi) => ({
        kpiId: kpi.kpiId,
        score: kpi.managerScore || "",
        comments: kpi.managerComments || "",
      })),
    },
    validationSchema: Yup.object({
      employeeId: Yup.string().required("Select employee"),
      cycleId: Yup.string().required("Select cycle"),
      kpiResponses: Yup.array().of(
        Yup.object({
          score: Yup.number().required("Score required").min(0).max(100),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          EmployeeId: values.employeeId,
          CycleId: values.cycleId,
          Status: values.status,
          KPIResponses: values.kpiResponses.map((k) => ({
            KpiId: k.kpiId,
            Score: k.score,
            Comments: k.comments,
          })),
        };

        await axios.post(
          `https://localhost:7098/api/Appraisal/SubmitManagerAppraisal?managerId=${managerId}`,
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        Swal.fire("Success", "Manager Appraisal submitted!", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to submit manager appraisal", "error");
      }
    },
  });

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4>Manager Appraisal Form</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Employee *</Form.Label>
                  <Form.Select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    isInvalid={formik.errors.employeeId}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.employeeId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Cycle *</Form.Label>
                  <Form.Select
                    value={selectedCycleId}
                    onChange={(e) => setSelectedCycleId(e.target.value)}
                    isInvalid={formik.errors.cycleId}
                  >
                    <option value="">Select Cycle</option>
                    {cycles.map((c) => (
                      <option key={c.cycleId} value={c.cycleId}>
                        {c.cycleName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.cycleId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {formik.values.kpiResponses.map((kpi, idx) => (
              <Row className="mb-3" key={kpi.kpiId}>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>KPI ID: {kpi.kpiId} (Self Score: {kpis[idx]?.selfScore})</Form.Label>
                    <Form.Control
                      type="number"
                      name={`kpiResponses[${idx}].score`}
                      value={formik.values.kpiResponses[idx].score}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.errors.kpiResponses &&
                        formik.errors.kpiResponses[idx]?.score
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.kpiResponses &&
                        formik.errors.kpiResponses[idx]?.score}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      type="text"
                      name={`kpiResponses[${idx}].comments`}
                      value={formik.values.kpiResponses[idx].comments}
                      onChange={formik.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}

            <div className="text-end">
              <Button type="submit" variant="success">
                Submit Manager Appraisal
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManagerAppraisalForm;
