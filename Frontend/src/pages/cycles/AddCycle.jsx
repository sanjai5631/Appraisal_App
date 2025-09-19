// src/pages/appraisal/AddCycle.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const createApiUrl = "https://localhost:7098/api/Cycle/CreateCycle";
const updateApiUrl = "https://localhost:7098/api/Cycle/DeleteCycle?CycleId";
const financialYearApiUrl = "https://localhost:7098/api/Financial/GetAllFinancialYears";

const cycleOptions = [
  { id: 1, name: "Term-1 (APR-JUL)", startDate: "2025-08-01", endDate: "2025-08-31" },
  { id: 2, name: "Term-2 (AUG-NOV)", startDate: "2025-12-01", endDate: "2025-12-31" },
  { id: 3, name: "Term-3 (DEC-MAR)", startDate: "2026-03-01", endDate: "2026-03-31" },
];

const AddCycle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cycleData = location.state?.cycle || null;

  const [financialYears, setFinancialYears] = useState([]);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const res = await axios.get(financialYearApiUrl, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const years = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setFinancialYears(years);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch financial years.", "error");
      }
    };
    fetchFinancialYears();
  }, []);

  const initialValues = {
    cycleName: cycleData?.cycleName || "",
    startDate: cycleData?.startDate ? cycleData.startDate.split("T")[0] : "",
    endDate: cycleData?.endDate ? cycleData.endDate.split("T")[0] : "",
    financialyearid: cycleData?.financialYearId || "",
    statusId: cycleData?.statusId || 1,
    createdBy: cycleData?.createdBy || Number(localStorage.getItem("userId")),
    modifiedBy: Number(localStorage.getItem("userId")),
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerErrors({});

    if (!values.cycleName || !values.startDate || !values.endDate || !values.financialyearid) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      setSubmitting(false);
      return;
    }

    // Correct payload with numbers
    const payload = {
      cycleName: values.cycleName,
      startDate: values.startDate,
      endDate: values.endDate,
      financialyearid: Number(values.financialyearid),
      statusId: Number(values.statusId),
      createdBy: Number(values.createdBy),
      modifiedBy: Number(values.modifiedBy),
    };

    try {
      if (cycleData) {
        await axios.put(`${updateApiUrl}?CycleId=${cycleData.cycleId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("Updated", "Cycle updated successfully", "success");
      } else {
        await axios.post(createApiUrl, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("Created", "Cycle created successfully", "success");
      }
      navigate("/appraisal-cycles");
    } catch (err) {
      console.error("Error saving cycle:", err.response?.data || err.message);

      // Map backend validation errors
      const errors = {};
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          const cleanKey = key.replace("request.", "").replace("$.",""); // clean backend key
          errors[cleanKey] = err.response.data.errors[key][0];
        });
      }
      setServerErrors(errors);
      setSubmitting(false);
      Swal.fire("Error", "Failed to save cycle", "error");
    }
  };

  const handleCycleOptionChange = (id, setFieldValue) => {
    const selectedCycle = cycleOptions.find((c) => c.id === Number(id));
    if (selectedCycle) {
      setFieldValue("cycleName", selectedCycle.name);
      setFieldValue("startDate", selectedCycle.startDate);
      setFieldValue("endDate", selectedCycle.endDate);
    } else {
      setFieldValue("cycleName", "");
      setFieldValue("startDate", "");
      setFieldValue("endDate", "");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4>{cycleData ? "Edit Cycle" : "Add Cycle"}</h4>
        </Card.Header>
        <Card.Body>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, setFieldValue, handleChange, isSubmitting }) => (
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <label>Cycle *</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleCycleOptionChange(e.target.value, setFieldValue)}
                    >
                      <option value="">-- Select Cycle --</option>
                      {cycleOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {serverErrors.cycleName && (
                      <div className="text-danger">{serverErrors.cycleName}</div>
                    )}
                  </Col>

                  <Col md={3}>
                    <label>Publish Date *</label>
                    <Field type="date" name="startDate" className="form-control" />
                    {serverErrors.startDate && (
                      <div className="text-danger">{serverErrors.startDate}</div>
                    )}
                  </Col>

                  <Col md={3}>
                    <label>Due Date *</label>
                    <Field type="date" name="endDate" className="form-control" />
                    {serverErrors.endDate && (
                      <div className="text-danger">{serverErrors.endDate}</div>
                    )}
                  </Col>

                  <Col md={6} className="mt-3">
                    <label>Financial Year *</label>
                    <select
                      className="form-select"
                      name="financialyearid"
                      value={values.financialyearid}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Year --</option>
                      {financialYears.map((fy) => (
                        <option
                          key={fy.financialYearId ?? fy.financialyearid}
                          value={fy.financialYearId ?? fy.financialyearid}
                        >
                          {fy.yearName ?? fy.yearname}
                        </option>
                      ))}
                    </select>
                    {serverErrors.financialyearid && (
                      <div className="text-danger">{serverErrors.financialyearid}</div>
                    )}
                  </Col>
                </Row>

                <div className="text-end mt-3">
                  <Button type="submit" className="me-2" variant={cycleData ? "warning" : "success"} disabled={isSubmitting}>
                    {cycleData ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => navigate("/appraisal-cycles")}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddCycle;
