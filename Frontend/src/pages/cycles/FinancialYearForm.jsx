// src/pages/cycles/FinancialYearForm.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import CardWrapper from "../../Component/CardWrapper";

const createApiUrl = "https://localhost:7098/api/Financial/CreateFinancialYear";
const updateApiUrl = "https://localhost:7098/api/Financial/UpdateFinancialYear";
const getFinancialYearsApiUrl = "https://localhost:7098/api/Financial/GetAllFinancialYears";

const FinancialYearForm = ({ show, onHide, onSuccess, editData }) => {
  const [existingYears, setExistingYears] = useState([]);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const res = await axios.get(getFinancialYearsApiUrl, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const years = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setExistingYears(years);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch financial years.", "error");
      }
    };
    fetchFinancialYears();
  }, []);

  const initialValues = {
    yearName: editData?.yearName || "",
    startYear: editData?.startYear || "",
    endYear: editData?.endYear || "",
  };

  const validationSchema = Yup.object({
    yearName: Yup.string().required("Year Name is required"),
    startYear: Yup.number()
      .required("Start Year is required")
      .min(1900, "Start Year must be valid"),
    endYear: Yup.number()
      .required("End Year is required")
      .min(1900, "End Year must be valid")
      .moreThan(Yup.ref("startYear"), "End Year must be greater than Start Year"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerErrors({});

    // Duplicate check
    const duplicate = existingYears.find(
      (y) =>
        y.yearName.toLowerCase() === values.yearName.toLowerCase() &&
        (!editData || y.financialYearId !== editData.financialYearId)
    );

    if (duplicate) {
      await Swal.fire("Warning", "This financial year already exists.", "warning");
      setSubmitting(false);
      return;
    }

    try {
      if (editData) {
        await axios.put(`${updateApiUrl}?financialYearId=${editData.financialYearId}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        await Swal.fire("Updated!", "Financial year updated successfully.", "success");
      } else {
        await axios.post(createApiUrl, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        await Swal.fire("Added!", "Financial year added successfully.", "success");
      }
      onHide();
      onSuccess();
    } catch (err) {
      console.error("Error saving financial year:", err.response?.data || err.message);
      const errors = {};
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          const cleanKey = key.replace("request.", "").replace("$.", "");
          errors[cleanKey] = err.response.data.errors[key][0];
        });
      }
      setServerErrors(errors);
      setSubmitting(false);
      await Swal.fire("Error", "Failed to save financial year.", "error");
    }
  };

  if (!show) return null;

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <CardWrapper
            variant="default"
            hover={true}
            header={
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar-range-fill me-2"></i>
                <h4 className="mb-0 text-dark">
                  {editData ? "Update Financial Year" : "Add Financial Year"}
                </h4>
              </div>
            }
          >
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Row className="mb-3">
                    <Col md={4}>
                      <label className="form-label fw-semibold">Year Name *</label>
                      <Field
                        type="text"
                        name="yearName"
                        placeholder="e.g., 2024-2025"
                        className={`form-control ${touched.yearName && errors.yearName ? "is-invalid" : ""}`}
                      />
                      {touched.yearName && errors.yearName && (
                        <div className="invalid-feedback">{errors.yearName}</div>
                      )}
                      {serverErrors.yearName && <div className="text-danger small mt-1">{serverErrors.yearName}</div>}
                    </Col>

                    <Col md={4}>
                      <label className="form-label fw-semibold">Start Year *</label>
                      <Field
                        type="number"
                        name="startYear"
                        placeholder="e.g., 2024"
                        className={`form-control ${touched.startYear && errors.startYear ? "is-invalid" : ""}`}
                      />
                      {touched.startYear && errors.startYear && (
                        <div className="invalid-feedback">{errors.startYear}</div>
                      )}
                      {serverErrors.startYear && <div className="text-danger small mt-1">{serverErrors.startYear}</div>}
                    </Col>

                    <Col md={4}>
                      <label className="form-label fw-semibold">End Year *</label>
                      <Field
                        type="number"
                        name="endYear"
                        placeholder="e.g., 2025"
                        className={`form-control ${touched.endYear && errors.endYear ? "is-invalid" : ""}`}
                      />
                      {touched.endYear && errors.endYear && (
                        <div className="invalid-feedback">{errors.endYear}</div>
                      )}
                      {serverErrors.endYear && <div className="text-danger small mt-1">{serverErrors.endYear}</div>}
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="me-3"
                      onClick={onHide}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Cancel
                    </Button>
                    <Button type="submit" variant={editData ? "warning" : "success"} size="lg" disabled={isSubmitting}>
                      <i className="bi bi-check-circle me-2"></i>
                      {editData ? "Update Financial Year" : "Create Financial Year"}
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

export default FinancialYearForm;
