// src/pages/financial/FinancialYearForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
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
          debugger
        await axios.put(
          `https://localhost:7098/api/Financial/UpdateFinancialYear?financialYearId=${editData.financialYearId}`,
          values
        );
          Swal.fire("Updated!", "Financial year updated successfully", "success");
        } else {
        await axios.post(
          "https://localhost:7098/api/Financial/CreateFinancialYear",
          values
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Financial Year" : "Add Financial Year"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Year Name</Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>Start Year</Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>End Year</Form.Label>
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

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FinancialYearForm;
