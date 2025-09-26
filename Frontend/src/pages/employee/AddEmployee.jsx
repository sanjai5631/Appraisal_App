import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

const genderMap = { Male: "1", Female: "2", Other: "3" };
const roleMap = {
  "Developer": "1",
  "Tester": "2",
  "Marketing": "3",
  "Client Support": "4",
  "HR & Finance": "5",
  "Manager": "6",
};
const qualificationMap = {
  "B.Tech": "1",
  "MCA": "2",
  "MBA HR": "3",
  "MBA Marketing": "4",
  "CA": "5",
  "B.E": "6",
  "BA": "7",
};
const unitMap = {
  "Unit 1": "1",
  "Unit 2": "2",
  "Unit 3": "3",
  "Unit 4": "4",
  "Unit 5": "5",
};
const departmentMap = {
  "Development": "1",
  "Testing": "2",
  "Marketing": "3",
  "Client Support": "4",
  "Human Resources": "5",
};

const AddEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeId = location.state?.employeeId || null;
  const isUpdateMode = !!employeeId;

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      empCode: "",
      name: "",
      genderId: "",
      religion: "",
      phone: "",
      email: "",
      password: "",
      roleId: "",
      qualificationId: "",
      dob: "",
      joiningDate: "",
      unitId: "",
      departmentId: "",
      isActive: true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      empCode: Yup.string()
        .min(3, "Minimum 3 characters")
        .max(20, "Maximum 20 characters")
        .required("Employee Code is required"),
      name: Yup.string().max(100).required("Employee name is required"),
      genderId: Yup.string().required("Gender is required"),
      email: Yup.string().email().required("Email address is required"),
      password: isUpdateMode
        ? Yup.string() // optional for update
        : Yup.string().min(6).max(50).required("Password is required"),
      roleId: Yup.string().required("Role is required"),
      unitId: Yup.string().required("Unit is required"),
      departmentId: Yup.string().required("Department is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

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
          DeptId: values.departmentId ? parseInt(values.departmentId) : null,
          IsActive: values.isActive,
        };

        if (values.password) payload.Password = values.password;

        if (isUpdateMode) {
          debugger
          await axios.put(
            `https://localhost:7098/api/Employee/UpdateEmployeeDetails?employeeId=${employeeId}`,
            payload,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          Swal.fire("Updated", "Employee updated successfully!", "success");
        } else {
          await axios.post(
            "https://localhost:7098/api/Employee/SaveEmployeeDetails",
            payload,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          Swal.fire("Success", "Employee added successfully!", "success");
          resetForm();
        }

        navigate("/view-employees");
      } catch (error) {
        console.error("Error saving employee:", error.response?.data || error.message);
        Swal.fire("Error", "Failed to save employee.", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchEmployee = async (id) => {
    try {
      setLoading(true);
      const resp = await axios.get(
        `https://localhost:7098/api/Employee/GetEmployee?EmployeeId=${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const emp = resp.data.data;
      console.log("Fetched employee:", emp);

      formik.setValues({
        empCode: emp.empCode || "",
        name: emp.name || "",
        genderId: genderMap[emp.gender] || "",
        religion: emp.religion || "",
        phone: emp.phone || "",
        email: emp.email || "",
        password: "",
        roleId: roleMap[emp.role] || "",
        qualificationId: qualificationMap[emp.qualification] || "",
        dob: emp.dob ? emp.dob.split("T")[0] : "",
        joiningDate: emp.joiningDate ? emp.joiningDate.split("T")[0] : "",
        unitId: unitMap[emp.unit] || "",
        departmentId: departmentMap[emp.department] || "",
        isActive: emp.isActive ?? true,
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
      Swal.fire("Error", "Failed to fetch employee data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdateMode) fetchEmployee(employeeId);
  }, [employeeId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <CardWrapper
            variant="default"
            hover={true}
            header={
              <div className="d-flex align-items-center">
                <i className="bi bi-person-plus-fill me-2"></i>
                <h4 className="mb-0 text-dark">
                  {isUpdateMode ? "Update Employee" : "Add Employee"}
                </h4>
              </div>
            }
          >
            <Form onSubmit={formik.handleSubmit}>
              {/* Employee Code, Name, Gender */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Employee Code *</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("empCode")}
                      isInvalid={!!formik.errors.empCode && formik.touched.empCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.empCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("name")}
                      isInvalid={!!formik.errors.name && formik.touched.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Gender *</Form.Label>
                    <Form.Select
                      {...formik.getFieldProps("genderId")}
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
              </Row>

              {/* Religion, Phone, Email */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Religion</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("religion")}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("phone")}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      {...formik.getFieldProps("email")}
                      isInvalid={!!formik.errors.email && formik.touched.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Password, Role, Qualification */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Password {isUpdateMode ? "(Leave blank to keep current)" : "*"}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      {...formik.getFieldProps("password")}
                      isInvalid={!!formik.errors.password && formik.touched.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Role *</Form.Label>
                    <Form.Select
                      {...formik.getFieldProps("roleId")}
                      isInvalid={!!formik.errors.roleId && formik.touched.roleId}
                    >
                      <option value="">Select Role</option>
                      <option value="1">Developer</option>
                      <option value="2">Tester</option>
                      <option value="3">Marketing</option>
                      <option value="4">Client Support</option>
                      <option value="5">HR & Finance</option>
                      <option value="6">Manager</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.roleId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Qualification</Form.Label>
                    <Form.Select {...formik.getFieldProps("qualificationId")}>
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
              </Row>

              {/* DOB, Joining Date, Unit */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      {...formik.getFieldProps("dob")}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      {...formik.getFieldProps("joiningDate")}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>  
                  <Form.Group>
                    <Form.Label>Unit *</Form.Label>
                    <Form.Select
                      {...formik.getFieldProps("unitId")}
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

              {/* Department, Active */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Department *</Form.Label>
                    <Form.Select {...formik.getFieldProps("departmentId")}>
                      <option value="">Select Department</option>
                      <option value="1">Development</option>
                      <option value="2">Testing</option>
                      <option value="3">Marketing</option>
                      <option value="4">Client Support</option>
                      <option value="5">Human Resources</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-center">
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

              <div className="text-end mt-4">
                <Button type="submit" variant="primary" size="lg">
                  <i className="bi bi-check-circle me-2"></i>
                  {isUpdateMode ? "Update Employee" : "Save Employee"}
                </Button>
              </div>
            </Form>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
