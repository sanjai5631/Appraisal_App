// src/pages/employee/ViewEmployees.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

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

  const handleEdit = (employeeId) => {
    navigate(`/create-employee`, { state: { employeeId } });
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


  return (
    <div className="container-fluid mt-5" >
      <div className="row">
        <div className="col-12">
          <CardWrapper
            variant="default"
            hover={true}
            loading={loading}
            header={
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h4 className="mb-0 text-dark">Employee Directory</h4>
                  <small className="text-muted">Total: {employees.length} Employees</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => navigate("/create-employee")}>
                    <PlusCircle className="me-1" />
                    Add Employee
                  </button>
                </div>
              </div>
            }
          >
            {employees.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-people display-1 text-muted"></i>
                </div>
                <h5 className="text-muted">No Employees Found</h5>
                <p className="text-muted mb-4">Get started by adding your first employee to the system.</p>
                <button className="btn btn-primary" onClick={() => navigate("/create-employee")}>
                  <PlusCircle className="me-2" />
                  Add First Employee
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-gear me-1"></i>
                        Actions
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-person-badge me-1"></i>
                        Employee Code
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-person me-1"></i>
                        Name
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-envelope me-1"></i>
                        Email
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-award me-1"></i>
                        Role
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-building me-1"></i>
                        Unit
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-diagram-3 me-1"></i>
                        Department
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.employeeId || emp.email}>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(emp.employeeId)}
                              title="Edit Employee"
                            >
                              <PencilSquare className="me-1" />
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(emp)}
                              title="Delete Employee"
                            >
                              <Trash className="me-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {emp.empCode}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2">
                              <i className="bi bi-person text-primary"></i>
                            </div>
                            <span className="fw-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{emp.email}</span>
                        </td>
                        <td>
                          <span className={`badge ${emp.role ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                            {emp.role || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted">{emp.unit || "N/A"}</span>
                        </td>
                        <td>
                          <span className="text-muted">{emp.department || "N/A"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployees;
