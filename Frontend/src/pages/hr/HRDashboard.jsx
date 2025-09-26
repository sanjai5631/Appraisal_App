import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import CardWrapper from "../../Component/CardWrapper";

const HrDashboard = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchedRef = useRef(false); // Prevent multiple fetches
  const token = localStorage.getItem("token");

  // Fetch all appraisals once
  const fetchAppraisals = async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const res = await axios.get(
        "https://localhost:7098/api/SelfAppraisal/GetAllAppraisal",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      if (data.length === 0) setError("No appraisals found.");
      setAppraisals(data);
    } catch (err) {
      console.error("Error fetching appraisals:", err);
      setError("Failed to fetch appraisals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const handleView = (appraisalId) => {
    navigate("/hr/view-appraisal", { state: { appraisalId, viewMode: true } });
  };

  const downloadCSV = () => {
    if (!appraisals.length) return;

    const headers = ["Employee", "Cycle", "Status", "Final Rating"];
    const rows = appraisals.map((a) => [
      a.employeeName || "",
      a.cycleName || "",
      a.status || "",
      a.finalRating || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "appraisals.csv");
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
            hover
            loading={loading}
            header={
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h4 className="mb-0 text-dark">HR Dashboard - Submitted Appraisals</h4>
                  <small className="text-muted">Total: {appraisals.length}</small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={downloadCSV}
                  >
                    <i className="bi bi-download me-1"></i> Export CSV
                  </button>
                </div>
              </div>
            }
          >
            {error ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-card-checklist display-1 text-muted"></i>
                </div>
                <h5 className="text-muted">{error}</h5>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="fw-semibold">Action</th>
                      <th scope="col" className="fw-semibold">Employee</th>
                      <th scope="col" className="fw-semibold">Cycle</th>
                      <th scope="col" className="fw-semibold">Status</th>
                      <th scope="col" className="fw-semibold">Final Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appraisals.map((a) => (
                      <tr key={a.appraisalId}>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleView(a.appraisalId)}
                          >
                            <Eye className="me-1" /> View
                          </button>
                        </td>
                        <td>{a.employeeName}</td>
                        <td>{a.cycleName}</td>
                        <td>
                          <span className={`badge ${
                            a.status === "Submitted" ? "bg-primary bg-opacity-10 text-primary" :
                            a.status === "Reviewed" ? "bg-success bg-opacity-10 text-success" :
                            "bg-secondary bg-opacity-10 text-secondary"
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td>{a.finalRating || "-"}</td>
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
};

export default HrDashboard;
