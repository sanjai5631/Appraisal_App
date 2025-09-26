// src/pages/cycles/AppraisalCycleForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

const cycleApiUrl = "https://localhost:7098/api/Cycle";
const financialApiUrl = "https://localhost:7098/api/Financial";

const AppraisalCyclePage = () => {
  const [cycles, setCycles] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cycles
  const fetchCycles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${cycleApiUrl}/GetAllCycles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCycles(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Error fetching cycles:", err);
      Swal.fire("Error", "Failed to fetch cycles", "error");
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch financial years
  const fetchFinancialYears = async () => {
    try {
      const res = await axios.get(`${financialApiUrl}/GetAllFinancialYears`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const years = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setFinancialYears(years);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0].financialYearId ?? years[0].financialyearid);
      }
    } catch (err) {
      console.error("Error fetching financial years:", err);
      Swal.fire("Error", "Failed to fetch financial years", "error");
      setFinancialYears([]);
    }
  };

  useEffect(() => {
    fetchCycles();
    fetchFinancialYears();
  }, []);

  // Filter cycles by selected year
  const filteredCycles = useMemo(() => {
    if (!selectedYear) return cycles;
    return cycles.filter(
      (c) => (c.financialYearId ?? c.financialyearid) === parseInt(selectedYear)
    );
  }, [cycles, selectedYear]);

  // Delete cycle
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${cycleApiUrl}/DeleteCycle?CycleId=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("Deleted", "Cycle deleted successfully", "success");
        fetchCycles();
      } catch (err) {
        console.error("Error deleting cycle:", err);
        Swal.fire("Error", "Failed to delete cycle", "error");
      }
    }
  };

  // Determine status based on end date
  const getCycleStatus = (cycle) => {
    const today = new Date();
    const endDate = new Date(cycle.endDate);
    return today > endDate ? "Inactive" : "Active";
  };

  // CSV export
  const downloadCSV = (data) => {
    if (!data || !data.length) return;

    const headers = ["Cycle Name", "Financial Year", "Start Date", "End Date", "Status"];
    const rows = data.map((c) => {
      const year = financialYears.find(
        (fy) => (fy.financialYearId ?? fy.financialyearid) === (c.financialYearId ?? c.financialyearid)
      );
      return [
        c.cycleName || "",
        year ? year.yearName ?? year.yearname : "",
        c.startDate ? new Date(c.startDate).toLocaleDateString() : "",
        c.endDate ? new Date(c.endDate).toLocaleDateString() : "",
        getCycleStatus(c)
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "appraisal_cycles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  <h4 className="mb-0 text-dark">Appraisal Cycles</h4>
                  <small className="text-muted">Total: {filteredCycles.length} Cycles</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm" onClick={() => navigate("/add-cycle")}>
                    <FaPlus className="me-1" />
                    Add Cycle
                  </button>
                  <button className="btn btn-outline-success btn-sm" onClick={() => downloadCSV(filteredCycles)}>
                    <FaDownload className="me-1" />
                    Export CSV
                  </button>
                </div>
              </div>
            }
          >
            {/* Financial Year Dropdown */}
            <div className="mb-4">
              <Form.Group className="d-flex align-items-center">
                <Form.Label className="me-3 fw-semibold mb-0">Filter by Financial Year:</Form.Label>
                <Form.Select
                  style={{ width: "300px" }}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">-- All Years --</option>
                  {financialYears.map((fy) => (
                    <option
                      key={fy.financialYearId ?? fy.financialyearid}
                      value={fy.financialYearId ?? fy.financialyearid}
                    >
                      {fy.yearName ?? fy.yearname}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {/* Cycles Table */}
            {filteredCycles.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-calendar-event display-1 text-muted"></i>
                </div>
                <h5 className="text-muted">No Cycles Found</h5>
                <p className="text-muted mb-4">
                  {selectedYear
                    ? "No appraisal cycles found for the selected financial year."
                    : "Get started by adding your first appraisal cycle."
                  }
                </p>
                <button className="btn btn-success" onClick={() => navigate("/add-cycle")}>
                  <FaPlus className="me-2" />
                  Add First Cycle
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="fw-semibold"><i className="bi bi-calendar-event me-1"></i>Cycle Name</th>
                      <th scope="col" className="fw-semibold"><i className="bi bi-calendar-range me-1"></i>Financial Year</th>
                      <th scope="col" className="fw-semibold"><i className="bi bi-calendar-check me-1"></i>Start Date</th>
                      <th scope="col" className="fw-semibold"><i className="bi bi-calendar-x me-1"></i>End Date</th>
                      <th scope="col" className="fw-semibold"><i className="bi bi-toggle-on me-1"></i>Status</th>
                      <th scope="col" className="fw-semibold text-center"><i className="bi bi-gear me-1"></i>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCycles.map((c) => {
                      const year = financialYears.find(
                        (fy) => (fy.financialYearId ?? fy.financialyearid) === (c.financialYearId ?? c.financialyearid)
                      );
                      return (
                        <tr key={c.cycleId}>
                          <td><span className="fw-medium">{c.cycleName}</span></td>
                          <td><span className="text-muted">{year ? year.yearName ?? year.yearname : "-"}</span></td>
                          <td><span className="text-muted">{new Date(c.startDate).toLocaleDateString()}</span></td>
                          <td><span className="text-muted">{new Date(c.endDate).toLocaleDateString()}</span></td>
                          <td>
                            <span className={`badge ${
                              getCycleStatus(c) === "Active"
                                ? "bg-success bg-opacity-10 text-success"
                                : "bg-warning bg-opacity-10 text-warning"
                            }`}>
                              {getCycleStatus(c)}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => navigate("/add-cycle", { state: { cycle: c } })}
                                title="Edit Cycle"
                              >
                                <FaEdit className="me-1" /> Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(c.cycleId)}
                                title="Delete Cycle"
                              >
                                <FaTrash className="me-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default AppraisalCyclePage;
