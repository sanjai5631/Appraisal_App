// src/components/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginImg from "../assets/login-img.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { empCode: "", password: "" },
    validationSchema: Yup.object({
      empCode: Yup.string().trim().required("Employee Code is required"),
      password: Yup.string().trim().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await axios.post("https://localhost:7098/api/Auth/Login", values);

        // Save user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("empCode", res.data.empCode);
        localStorage.setItem("role", res.data.role || "employee");
        localStorage.setItem("deptId", res.data.deptId || 0);
        localStorage.setItem("employeeId", res.data.employeeId);

        login(); // Update auth context

        // Navigate based on role
        if (res.data.role === "hr") navigate("/dashboard/hr");
        else if (res.data.role === "manager") navigate("/dashboard/manager");
        else navigate("/employee");
      } catch (err) {
        const backendError = err.response?.data;
        if (backendError?.field && backendError?.message) {
          setErrors({ [backendError.field]: backendError.message });
        } else if (err.response?.status === 401) {
          // Fallback if unauthorized
          setErrors({ empCode: "Employee Code is invalid", password: "Password is incorrect" });
        } else {
          setErrors({ password: "Server error, try again later" });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-side-img">
        <img src={loginImg} alt="Login" />
      </div>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>Employee Code</label>
            <input
              type="text"
              name="empCode"
              value={formik.values.empCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your employee code"
            />
            {formik.errors.empCode && <div className="error">{formik.errors.empCode}</div>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.errors.password && <div className="error">{formik.errors.password}</div>}
          </div>

          <button type="submit" className="login-btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
