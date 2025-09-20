// src/pages/appraisal/SelfAppraisalForm.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const SelfAppraisalForm = ({ employeeId }) => {
  const [cycles, setCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [kpis, setKpis] = useState([]);

  // Fetch cycles from backend
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const res = await axios.get("https://localhost:7098/api/Cycle/GetAllCycles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCycles(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch cycles", "error");
      }
    };
    fetchCycles();
  }, []);

  // Fetch current form when cycle changes
  useEffect(() => {
    if (!selectedCycleId) return;
    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7098/api/SelfAppraisal/GetAllSelfAppraisal`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setKpis(res.data.data?.kpiResponses || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch appraisal form", "error");
      }
    };
    fetchForm();
  }, [selectedCycleId, employeeId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeId,
      cycleId: selectedCycleId,
      kpiResponses: kpis.map((kpi) => ({
        kpiId: kpi.kpiId,
        score: kpi.selfScore || "",
        comments: kpi.selfComments || "",
      })),
    },
    validationSchema: Yup.object({
      cycleId: Yup.string().required("Please select a cycle"),
      kpiResponses: Yup.array().of(
        Yup.object({
          score: Yup.number()
            .required("Score required")
            .min(0, "Min 0")
            .max(100, "Max 100"),
          comments: Yup.string().max(500, "Max 500 chars"),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          EmployeeId: values.employeeId,
          CycleId: values.cycleId,
          KPIResponses: values.kpiResponses.map((k) => ({
            KpiId: k.kpiId,
            Score: k.score,
            Comments: k.comments,
          })),
        };

        await axios.post(
          "https://localhost:7098/api/Appraisal/SubmitSelfAppraisal",
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        Swal.fire("Success", "Self-Appraisal submitted!", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to submit self-appraisal", "error");
      }
    },
  });

  const handleCycleChange = (e) => {
    setSelectedCycleId(e.target.value);
  };

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4>Self-Appraisal Form</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Cycle *</Form.Label>
                  <Form.Select
                    name="cycleId"
                    value={selectedCycleId}
                    onChange={handleCycleChange}
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
                    <Form.Label>KPI ID: {kpi.kpiId}</Form.Label>
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
                Submit Self-Appraisal
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SelfAppraisalForm;
