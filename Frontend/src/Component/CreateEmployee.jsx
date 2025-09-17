// src/components/CreateEmployee.jsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CreateEmployee() {
  const { role } = useAuth();
  // HR’s EmployeeId (or EmployeeCode?) from login/storage
  const hrEmpId = parseInt(localStorage.getItem("employeeId"), 10) || 0;  

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
      qualificationId: "",  // optional
      unitId: ""  // optional
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Enter 10-digit number").required("Phone is required"),
      gender: Yup.string().required("Select gender"),
      department: Yup.string().required("Select department"),
      // qualificationId etc can be optional
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
          EmpCode: "", // let backend generate if possible
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

        const resp = await axios.post(
          "https://localhost:7098/api/Employee/SaveEmployeeDetails",
          payload
        );

        if (resp.status === 200 || resp.status === 201) {
          alert("Employee created successfully!");
          resetForm();
        } else {
          alert("Unexpected response from server.");
        }
      } catch (err) {
        console.error("Error saving employee:", err);
        if (err.response && err.response.data && err.response.data.message) {
          alert("Server: " + err.response.data.message);
        } else {
          alert("Error creating employee. Try again.");
        }
      }
    },
  });

  return (
    <div className="create-employee-form">
      <h2>Create Employee</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name && <div className="error">{formik.errors.name}</div>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}
        </div>

        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          {formik.touched.phone && formik.errors.phone && <div className="error">{formik.errors.phone}</div>}
        </div>

        <div>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && <div className="error">{formik.errors.gender}</div>}
        </div>

        <div>
          <select
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
          >
            <option value="">Select Department</option>
            <option value="Developer">Developer</option>
            <option value="Tester">Tester</option>
            <option value="Marketing">Marketing</option>
            <option value="ClientSupport">Client Support</option>
            <option value="HR & Finance">HR & Finance</option>
            <option value="Manager">Manager</option>
          </select>
          {formik.touched.department && formik.errors.department && <div className="error">{formik.errors.department}</div>}
        </div>

        <div>
          <input
            type="date"
            name="dob"
            value={formik.values.dob}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <input
            type="date"
            name="joiningDate"
            value={formik.values.joiningDate}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="qualificationId"
            placeholder="Qualification ID (optional)"
            value={formik.values.qualificationId}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="unitId"
            placeholder="Unit ID (optional)"
            value={formik.values.unitId}
            onChange={formik.handleChange}
          />
        </div>

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Saving..." : "Save Employee"}
        </button>
      </form>
    </div>
  );
}
