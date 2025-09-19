// src/Component/AddEmployee.jsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const employeeData = location.state?.employee || null;

  const formik = useFormik({
    initialValues: {
      empCode: employeeData?.empCode || "",
      name: employeeData?.name || "",
      genderId: employeeData?.genderId?.toString() || "",
      religion: employeeData?.religion || "",
      phone: employeeData?.phone || "",
      email: employeeData?.email || "",
      password: "",
      roleId: employeeData?.roleId?.toString() || "",
      qualificationId: employeeData?.qualificationId?.toString() || "",
      dob: employeeData?.dob ? employeeData.dob.split("T")[0] : "",
      joiningDate: employeeData?.joiningDate
        ? employeeData.joiningDate.split("T")[0]
        : "",
      unitId: employeeData?.unitId?.toString() || "",
      departmentId: employeeData?.departmentId?.toString() || "",
      isActive: employeeData?.isActive ?? true,
      createdBy: employeeData?.createdBy?.toString() || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      empCode: Yup.string().max(20).required("Employee Code is required"),
      name: Yup.string().max(100).required("Employee name is required"),
      genderId: Yup.string().required("Gender is required"),
      email: Yup.string().email().required("Email address is required"),
      password: employeeData
        ? Yup.string()
        : Yup.string().min(6).max(50).required("Password is required"),
      roleId: Yup.string().required("Role is required"),
      unitId: Yup.string().required("Unit is required"),
      departmentId: Yup.string().required("Department is required"),
      createdBy: Yup.string().required("EmployeeId is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // build payload
        const payload = {
          EmpCode: values.empCode,
          Name: values.name,
          GenderId: parseInt(values.genderId),
          Religion: values.religion,
          Phone: values.phone,
          Email: values.email,
          RoleId: parseInt(values.roleId),
          QualificationId: values.qualificationId
            ? parseInt(values.qualificationId)
            : null,
          Dob: values.dob || null,
          JoiningDate: values.joiningDate || null,
          UnitId: parseInt(values.unitId),
          DepartmentId: values.departmentId ? parseInt(values.departmentId) : null,
          IsActive: values.isActive,
        };

        // password only if set
        if (values.password) {
          payload.Password = values.password;
        }
        
        // set audit fields
        if (employeeData) {
          payload.ModifiedBy = parseInt(values.createdBy);
          // update
             debugger
          await axios.put(
            `https://localhost:7098/api/Employee/UpdateEmployeeDetails?employeeId=${employeeData.employeeId}`,
            payload,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          Swal.fire("Updated", "Employee updated successfully!", "success");
        } else {
          payload.CreatedBy = parseInt(values.createdBy);
          // save
          await axios.post(
            "https://localhost:7098/api/Employee/SaveEmployeeDetails",
            payload,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          Swal.fire("Success", "Employee added successfully!", "success");
          resetForm();
        }

        navigate("/view-employees");
      } catch (error) {
        console.error("Error saving employee:", error.response?.data || error.message);
        Swal.fire("Error", "Failed to save employee.", "error");
      }
    },
  });

  return (
    <div style={{ paddingTop: "80px" }} className="container">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            {employeeData ? "Update Employee" : "Add Employee"}
          </h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            {/* Employee Code & Name */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Employee Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="empCode"
                    value={formik.values.empCode}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.empCode && formik.touched.empCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.empCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.name && formik.touched.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Gender & Religion */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select
                    name="genderId"
                    value={formik.values.genderId}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.genderId && formik.touched.genderId}
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.genderId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Religion</Form.Label>
                  <Form.Control
                    type="text"
                    name="religion"
                    value={formik.values.religion}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Phone & Email */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.email && formik.touched.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Password & Role */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Password {employeeData ? "(Leave blank to keep current)" : "*"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.password && formik.touched.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role *</Form.Label>
                  <Form.Select
                    name="roleId"
                    value={formik.values.roleId}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.roleId && formik.touched.roleId}
                  >
                    <option value="">Select Role</option>
                    <option value="1">Developer</option>
                    <option value="2">Tester</option>
                    <option value="3">Marketing</option>
                    <option value="4">Client Support</option>
                    <option value="5">HR</option>
                    <option value="6">Manager</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.roleId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Qualification & DOB */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Qualification</Form.Label>
                  <Form.Select
                    name="qualificationId"
                    value={formik.values.qualificationId}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select Qualification</option>
                    <option value="1">B.Tech</option>
                    <option value="2">MCA</option>
                    <option value="3">MBA HR</option>
                    <option value="4">MBA Marketing</option>
                    <option value="5">CA</option>
                    <option value="6">B.E</option>
                    <option value="7">BA</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Joining Date & Unit */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="joiningDate"
                    value={formik.values.joiningDate}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Unit *</Form.Label>
                  <Form.Select
                    name="unitId"
                    value={formik.values.unitId}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.unitId && formik.touched.unitId}
                  >
                    <option value="">Select Unit</option>
                    <option value="1">Unit 1</option>
                    <option value="2">Unit 2</option>
                    <option value="3">Unit 3</option>
                    <option value="4">Unit 4</option>
                    <option value="5">Unit 5</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.unitId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

                      {/* 🔹 Department */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={formik.values.departmentId}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select Department</option>
                    <option value="1">Development</option>
                    <option value="2">Testing</option>
                    <option value="3">Marketing</option>
                    <option value="4">Client Support</option>
                    <option value="5">Human Resources</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* CreatedBy / ModifiedBy */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    {employeeData
                      ? "Modified By (HR EmployeeId) *"
                      : "Created By (HR EmployeeId) *"}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="createdBy"
                    value={formik.values.createdBy}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.createdBy && formik.touched.createdBy}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.createdBy}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={(e) =>
                    formik.setFieldValue("isActive", e.target.checked)
                  }
                />
              </Col>
            </Row>

            <div className="text-end">
              <Button type="submit" variant="primary">
                {employeeData ? "Update Employee" : "Save Employee"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEmployee;
