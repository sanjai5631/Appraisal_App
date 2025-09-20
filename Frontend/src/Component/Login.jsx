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
      empCode: Yup.string().required("Employee Code is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await axios.post("https://localhost:7098/api/Auth/Login", values);

        // Store data in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("empCode", res.data.empCode);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("deptId",res.data.deptId);
        localStorage.setItem("employeeId",res.data.employeeId)

        // Update AuthContext
        login();

        // Redirect based on role
        if (res.data.role === "hr") navigate("/dashboard/hr");
        else if (res.data.role === "manager") navigate("/dashboard/manager");
        else navigate("/employee");
      } catch (err) {
        if (err.response?.status === 401) setErrors({ password: "Invalid employee code or password" });
        else setErrors({ password: "Server error, please try again later" });
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
  });

  return (
    <div className="login-container">
      <div className="login-side-img"><img src={loginImg} alt="Login" /></div>
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
              placeholder="Enter your employee code"
              required
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
              placeholder="Enter your password"
              required
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
