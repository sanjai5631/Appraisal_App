// src/pages/cycles/AddCycle.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

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
      await Swal.fire("Warning", "Please fill all required fields", "warning");
      setSubmitting(false);
      return;
    }

    const payload = {
      cycleName: values.cycleName,
      startDate: values.startDate,
      endDate: values.endDate,
      financialyearid: Number(values.financialyearid),
      statusId: cycleData ? Number(values.statusId) : 1, 
      createdBy: Number(values.createdBy),
      modifiedBy: Number(values.modifiedBy),
    };

    try {
      if (cycleData) {
        await axios.put(`${updateApiUrl}?CycleId=${cycleData.cycleId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        await Swal.fire("Updated", "Cycle updated successfully", "success"); // wait for alert
      } else {
        await axios.post(createApiUrl, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        await Swal.fire("Created", "Cycle created successfully", "success"); // wait for alert
      }
      navigate("/appraisal-cycle"); // navigate after alert closes
    } catch (err) {
      console.error("Error saving cycle:", err.response?.data || err.message);

      const errors = {};
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          const cleanKey = key.replace("request.", "").replace("$.", "");
          errors[cleanKey] = err.response.data.errors[key][0];
        });
      }
      setServerErrors(errors);
      setSubmitting(false);
      await Swal.fire("Error", "Failed to save cycle", "error");
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
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <CardWrapper
            variant="default"
            hover={true}
            header={
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar-plus-fill me-2"></i>
                <h4 className="mb-0 text-dark">
                  {cycleData ? "Update Cycle" : "Add Cycle"}
                </h4>
              </div>
            }
          >
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, setFieldValue, handleChange, isSubmitting }) => (
                <Form>
                  <Row className="mb-3">
                    <Col md={4}>
                      <label className="form-label fw-semibold">Financial Year *</label>
                      <select
                        className="form-select"
                        name="financialyearid"
                        value={values.financialyearid}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Financial Year --</option>
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
                        <div className="text-danger small mt-1">{serverErrors.financialyearid}</div>
                      )}
                    </Col>

                    <Col md={4}>
                      <label className="form-label fw-semibold">Cycle Template *</label>
                      <select
                        className="form-select"
                        onChange={(e) => handleCycleOptionChange(e.target.value, setFieldValue)}
                      >
                        <option value="">-- Select Cycle Template --</option>
                        {cycleOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {serverErrors.cycleName && (
                        <div className="text-danger small mt-1">{serverErrors.cycleName}</div>
                      )}
                    </Col>

                      <Col md={4}>
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        name="statusId"
                        value={values.statusId}
                        onChange={handleChange}
                        disabled={!cycleData} // ✅ Disable dropdown if creating a new cycle
                      >
                        <option value={1}>Active</option>
                        <option value={2}>Inactive</option>
                      </select>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
                      <label className="form-label fw-semibold">Publish Date *</label>
                      <Field type="date" name="startDate" className="form-control" />
                      {serverErrors.startDate && (
                        <div className="text-danger small mt-1">{serverErrors.startDate}</div>
                      )}
                    </Col>

                    <Col md={4}>
                      <label className="form-label fw-semibold">Due Date *</label>
                      <Field type="date" name="endDate" className="form-control" />
                      {serverErrors.endDate && (
                        <div className="text-danger small mt-1">{serverErrors.endDate}</div>
                      )}
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="me-3"
                      onClick={() => navigate("/appraisal-cycle")}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant={cycleData ? "warning" : "success"}
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {cycleData ? "Update Cycle" : "Create Cycle"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default AddCycle;
