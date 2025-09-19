// src/pages/cycles/FinancialYearForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

const FinancialYearForm = ({ show, onHide, onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      yearName: "",
      startYear: "",
      endYear: "",
    },
    validationSchema: Yup.object({
      yearName: Yup.string().required("Year Name is required"),
      startYear: Yup.number()
        .required("Start Year is required")
        .min(1900, "Start Year must be valid"),
      endYear: Yup.number()
        .required("End Year is required")
        .min(1900, "End Year must be valid")
        .moreThan(Yup.ref("startYear"), "End Year must be greater than Start Year"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (editData) {
          await axios.put(
            `https://localhost:7098/api/Financial/UpdateFinancialYear?financialYearId=${editData.financialYearId}`,
            values,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          Swal.fire("Updated!", "Financial year updated successfully", "success");
        } else {
          await axios.post(
            "https://localhost:7098/api/Financial/CreateFinancialYear",
            values,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          Swal.fire("Added!", "Financial year added successfully", "success");
        }
        onHide();
        onSuccess();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Something went wrong", "error");
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (editData) {
      formik.setValues({
        yearName: editData.yearName || "",
        startYear: editData.startYear || "",
        endYear: editData.endYear || "",
      });
    } else {
      formik.resetForm();
    }
  }, [editData]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-calendar-range-fill me-2"></i>
          {editData ? "Update Financial Year" : "Add Financial Year"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {/* Year Name & Start Year & End Year */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Year Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="yearName"
                  placeholder="e.g., 2024-2025"
                  value={formik.values.yearName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.yearName && formik.errors.yearName}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.yearName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Start Year *</Form.Label>
                <Form.Control
                  type="number"
                  name="startYear"
                  placeholder="e.g., 2024"
                  value={formik.values.startYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.startYear && formik.errors.startYear}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.startYear}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">End Year *</Form.Label>
                <Form.Control
                  type="number"
                  name="endYear"
                  placeholder="e.g., 2025"
                  value={formik.values.endYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.endYear && formik.errors.endYear}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.endYear}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Action Buttons */}
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
            <Button
              type="submit"
              variant={editData ? "warning" : "success"}
              size="lg"
              disabled={loading}
            >
              <i className="bi bi-check-circle me-2"></i>
              {loading ? "Saving..." : editData ? "Update Financial Year" : "Create Financial Year"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FinancialYearForm;
