// src/components/Login.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginImg from "../assets/login-img.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import jwtDecode from "jwt-decode";

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

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("empCode", res.data.empCode);

        const decoded = jwtDecode(res.data.token);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem("role", userRole);

        // Update AuthContext
        login();

        // Redirect based on role immediately
        if (userRole === "hr") navigate("/dashboard/hr");
        else if (userRole === "manager") navigate("/dashboard/manager");
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
            <input type="text" name="empCode" value={formik.values.empCode} onChange={formik.handleChange} placeholder="Enter your employee code" required />
            {formik.errors.empCode && <div className="error">{formik.errors.empCode}</div>}
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} placeholder="Enter your password" required />
            {formik.errors.password && <div className="error">{formik.errors.password}</div>}
          </div>
          <button type="submit" className="login-btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="signup-link">Don’t have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Login;
