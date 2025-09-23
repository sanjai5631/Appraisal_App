import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import FinancialYearForm from "./FinancialYearForm";
import CardWrapper from "../../Component/CardWrapper";
import "bootstrap-icons/font/bootstrap-icons.css";

const FinancialYearDashboard = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editYear, setEditYear] = useState(null);

  const token = localStorage.getItem("token"); // get token once

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7098/api/Financial/GetAllFinancialYears",
        {
          headers: { Authorization: `Bearer ${token}` }, // added auth header
        }
      );

      if (Array.isArray(response.data)) {
        setFinancialYears(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setFinancialYears(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setFinancialYears([]);
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
      Swal.fire("Error", "Failed to fetch financial years", "error");
      setFinancialYears([]);
    }
    setLoading(false);
  };

  const handleEdit = (year) => {
    setEditYear(year);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditYear(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://localhost:7098/api/Financial/DeleteFinancialYear?financialYearId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Deleted!", "Financial year deleted successfully", "success");
      fetchFinancialYears();
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Failed to delete financial year", "error");
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <CardWrapper
            variant="default"
            hover={true}
            loading={loading}
            header={
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h4 className="mb-0 text-dark">Financial Years</h4>
                  <small className="text-muted">Total: {financialYears.length} Years</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm" onClick={handleAdd}>
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Financial Year
                  </button>
                </div>
              </div>
            }
          >
            {financialYears.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-calendar-range display-1 text-muted"></i>
                </div>
                <h5 className="text-muted">No Financial Years Found</h5>
                <p className="text-muted mb-4">Get started by adding your first financial year.</p>
                <button className="btn btn-success" onClick={handleAdd}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add First Financial Year
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-calendar-range me-1"></i>
                        Year Name
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-calendar-check me-1"></i>
                        Start Year
                      </th>
                      <th scope="col" className="fw-semibold">
                        <i className="bi bi-calendar-x me-1"></i>
                        End Year
                      </th>
                      <th scope="col" className="fw-semibold text-center">
                        <i className="bi bi-gear me-1"></i>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialYears.map((year) => (
                      <tr key={year.financialYearId}>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {year.yearName}
                          </span>
                        </td>
                        <td>
                          <span className="fw-medium">{year.startYear}</span>
                        </td>
                        <td>
                          <span className="fw-medium">{year.endYear}</span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(year)}
                              title="Edit Financial Year"
                            >
                              <i className="bi bi-pencil-square me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(year.financialYearId)}
                              title="Delete Financial Year"
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardWrapper>

          {showModal && (
            <FinancialYearForm
              show={showModal}
              onHide={() => setShowModal(false)}
              onSuccess={fetchFinancialYears}
              editData={editYear}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialYearDashboard;
