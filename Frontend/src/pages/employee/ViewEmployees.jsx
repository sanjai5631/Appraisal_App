// src/Component/ViewEmployees.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

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

      const empData = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      if (empData.length === 0) {
        setError("No employees found.");
      }

      setEmployees(empData);
    } catch (err) {
      console.error("Error fetching employees:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 404) {
        setError("API not found. Check your backend route.");
      } else {
        setError("Failed to fetch employees.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    navigate(`/edit-employee/${employee.employeeId}`, { state: { employee } });
  };

  const handleDelete = async (employee) => {
    Swal.fire({
      title: `Are you sure you want to delete ${employee.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://localhost:7098/api/Employee/DeleteEmployee?EmployeeId=${employee.employeeId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setEmployees((prev) =>
            prev.filter((emp) => emp.employeeId !== employee.employeeId)
          );
          Swal.fire("Deleted!", `${employee.name} has been deleted.`, "success");
        } catch (err) {
          console.error("Error deleting employee:", err);
          Swal.fire("Error", "Failed to delete employee.", "error");
        }
      }
    });
  };

  // if (loading) return <div style={{ paddingTop: "80px" }}>Loading employees...</div>;
  // if (error) return <div style={{ paddingTop: "80px", color: "red" }}>{error}</div>;

  return (
    <div style={{ paddingTop: "80px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employee List</h2>
        <button className="btn btn-primary" onClick={() => navigate("/add-employee")}>
          <PlusCircle className="me-2" />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Actions</th>
              <th>Employee Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Unit</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId || emp.email}>
                <td>
                  <PencilSquare
                    className="text-primary me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(emp)}
                  />
                  <Trash
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(emp)}
                  />
                </td>
                <td>{emp.empCode}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role || "N/A"}</td>
                <td>{emp.unit || "N/A"}</td>
                <td>{emp.department || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewEmployees;
