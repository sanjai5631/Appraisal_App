// src/Component/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7098/api/Employee/GetAllEmployee",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // ✅ handle ApiResponse wrapper from backend
        if (res.data?.statusCode === 200 && res.data?.data) {
          setEmployees(res.data.data);
        } else {
          setError(res.data?.message || "No employees found.");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to fetch employees.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container" style={{ paddingTop: "80px" }}>
      <h2 className="mb-4">All Employees</h2>

      {loading && <p>Loading employees...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && employees.length > 0 && (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Emp Code</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td>{emp.empCode}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.gender}</td>
                <td>{emp.role}</td>
                <td>{emp.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && employees.length === 0 && !error && (
        <p>No employees available.</p>
      )}
    </div>
  );
}

export default Home;
