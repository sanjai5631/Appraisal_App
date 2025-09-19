// src/components/CreateEmployee.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Row, Col, Form, Button, Modal } from "react-bootstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function CreateEmployee() {
  const { role } = useAuth();
  const hrEmpId = parseInt(localStorage.getItem("employeeId"), 10) || 0;

  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const resp = await axios.get("https://localhost:7098/api/Employee/GetAllEmployee");
      const empData = Array.isArray(resp.data) ? resp.data : resp.data?.data || [];
      setEmployees(empData);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      department: "",
      dob: "",
      joiningDate: "",
      qualificationId: "",
      unitId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Enter 10-digit number").required("Phone is required"),
      gender: Yup.string().required("Select gender"),
      department: Yup.string().required("Select department"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const genderMap = { male: 1, female: 2, other: 3 };
        const roleMap = {
          Manager: 1,
          "HR & Finance": 2,
          Developer: 3,
          Tester: 3,
          Marketing: 3,
          ClientSupport: 3,
        };

        const payload = {
          EmpCode: "",
          Name: values.name,
          GenderId: genderMap[values.gender],
          Phone: values.phone,
          Email: values.email,
          Password: values.password,
          RoleId: roleMap[values.department] || 3,
          QualificationId: values.qualificationId ? parseInt(values.qualificationId, 10) : null,
          Dob: values.dob || null,
          JoiningDate: values.joiningDate || new Date().toISOString().split("T")[0],
          UnitId: values.unitId ? parseInt(values.unitId, 10) : null,
          IsActive: true,
          CreatedBy: hrEmpId,
        };

        if (editingEmployee) {
          await axios.put(
            `https://localhost:7098/api/Employee/UpdateEmployeeDetails?employeeId=${editingEmployee.EmployeeId}`,
            payload
          );
          setEditingEmployee(null);
        } else {
          await axios.post("https://localhost:7098/api/Employee/SaveEmployeeDetails", payload);
        }

        alert("Employee saved successfully!");
        resetForm();
        fetchEmployees();
      } catch (err) {
        console.error("Error saving employee:", err);
        alert(err.response?.data?.message || "Error saving employee. Try again.");
      }
    },
  });

  // Edit handler
  const handleEdit = async (employeeId) => {
    try {
      const resp = await axios.get(`https://localhost:7098/api/Employee/GetEmployee?EmployeeId=${employeeId}`);
      const emp = resp.data;
      setEditingEmployee(emp);
      formik.setValues({
        name: emp.Name || "",
        email: emp.Email || "",
        password: "",
        phone: emp.Phone || "",
        gender: emp.GenderId === 1 ? "male" : emp.GenderId === 2 ? "female" : "other",
        department: emp.RoleId === 1 ? "Manager" : emp.RoleId === 2 ? "HR & Finance" : "Employee",
        dob: emp.Dob ? emp.Dob.split("T")[0] : "",
        joiningDate: emp.JoiningDate ? emp.JoiningDate.split("T")[0] : "",
        qualificationId: emp.QualificationId || "",
        unitId: emp.UnitId || "",
      });
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  // Delete handler
  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`https://localhost:7098/api/Employee/DeleteEmployee?EmployeeId=${employeeId}`);
      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Error deleting employee.");
    }
  };

  // DataTable columns (only actions)
  const columns = [
    {
      name: "Actions",
      cell: row => (
        <div style={{ display: "flex", gap: "10px" }}>
          <FaEdit style={{ cursor: "pointer", color: "orange" }} onClick={() => handleEdit(row.EmployeeId)} />
          <FaTrash style={{ cursor: "pointer", color: "red" }} onClick={() => handleDelete(row.EmployeeId)} />
        </div>
      ),
    },
  ];

  const customStyles = {
    header: { style: { minHeight: "56px" } },
    headRow: { style: { borderTopStyle: "solid", borderTopWidth: "1px", borderTopColor: defaultThemes.default.divider.default } },
    headCells: { style: { "&:not(:last-of-type)": { borderRightStyle: "solid", borderRightWidth: "1px", borderRightColor: defaultThemes.default.divider.default } } },
    cells: { style: { "&:not(:last-of-type)": { borderRightStyle: "solid", borderRightWidth: "1px", borderRightColor: defaultThemes.default.divider.default } } },
  };

  return (
    <Container className="my-5">
      {/* Employee Form */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} className="mb-4">
        <Card.Header style={{ backgroundColor: "#87CEEB", color: "#fff", fontSize: "1.5rem" }}>
          {editingEmployee ? "Edit Employee" : "Create Employee"}
        </Card.Header>
        <Card.Body style={{ backgroundColor: "#ffffff" }}>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Add remaining fields as needed (password, phone, gender, department, dob, joiningDate, qualificationId, unitId) */}

            <Button type="submit" variant="info" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Saving..." : editingEmployee ? "Update Employee" : "Save Employee"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Employees Action Table */}
      <DataTable
        title="Employees"
        columns={columns}
        data={employees}
        pagination
        dense
        selectableRows={false}
        customStyles={customStyles}
      />
    </Container>
  );
}
