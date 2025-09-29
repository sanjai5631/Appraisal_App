// src/pages/appraisal/UnitAppraisal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquare, Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const UnitAppraisal = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // 🔹 same as ViewEmployees
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("employeeId");
  const token = localStorage.getItem("token");

  // Fetch employee appraisals
  const fetchAppraisals = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7098/api/SelfAppraisal/GetEmployeeById?employeeId=${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(res.data.data)
        ? res.data.data
        : res.data?.data
        ? [res.data.data]
        : [];

      if (!data.length) {
        Swal.fire({
          icon: "info",
          title: "No Appraisals",
          text: "No appraisals found for this employee.",
        });
      }

      setAppraisals(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch",
        text:
          err.response?.status === 401
            ? "Unauthorized. Please login again."
            : err.response?.status === 404
            ? "API not found. Check your backend route."
            : "Failed to fetch employee appraisals.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchAppraisals();
    else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Employee Not Found",
        text: "Please login again.",
      });
    }
  }, [employeeId]);

  // 🔹 Simple client-side search filter (like ViewEmployees)
  const filteredAppraisals = appraisals.filter(
    (a) =>
      a.empCode?.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      a.cycleName?.toLowerCase().includes(search.toLowerCase()) ||
      a.financialYear?.toString().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
  );

  // CSV download
  const downloadCSV = (data) => {
    if (!data || !data.length) return;

    const headers = ["Emp Code", "Employee Name", "Cycle", "Financial Year", "Status", "Overall Score"];
    const rows = data.map((row) => [
      row.empCode || "",
      row.employeeName || "",
      row.cycleName || "",
      row.financialYear || "",
      row.status || "",
      row.overallSelfScore?.toFixed(2) || 0,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "unit_appraisals.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mapAppraisalForForm = (appraisal) => {
    const kpiResponsesFull = (appraisal.kpiResponses || []).map((item) => ({
      kpiId: item.kpiId,
      kpiTitle: item.kpiName || "",
      kpiDescription: item.kpiDescription || "",
      kpiWeightage: item.kpiWeightage || 0,
      agileScore: item.selfScore || 0,
      supervisorScore: item.supervisorScore || 0,
      associateComment: item.associateComment || "",
      supervisorComment: item.supervisorComment || "",
      responseId: item.responseId || null,
    }));
    return { ...appraisal, kpiResponses: kpiResponsesFull };
  };

  const handleReview = (appraisal) => {
    navigate("/manager-review", {
      state: {
        appraisalData: mapAppraisalForForm(appraisal),
        empId: appraisal.employeeId,
        appraisalId: appraisal.appraisalId,
        viewMode: false,
        key: Date.now(),
      },
    });
  };

  const handleView = (appraisal) => {
    if (!appraisal?.appraisalId) {
      Swal.fire("Error", "Appraisal ID missing", "error");
      return;
    }
    navigate("/manager-review", {
      state: {
        appraisalData: mapAppraisalForForm(appraisal),
        empId: appraisal.employeeId,
        appraisalId: appraisal.appraisalId,
        viewMode: true,
        key: Date.now(),
      },
    });
  };

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-outline-success btn-sm p-2" onClick={() => handleReview(row)}>
            <PencilSquare />
          </button>
          <button className="btn btn-outline-info btn-sm p-2" onClick={() => handleView(row)}>
            <Eye />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    { name: "Emp Code", selector: (row) => row.empCode || "N/A", sortable: true },
    { name: "Employee Name", selector: (row) => row.employeeName || "N/A", sortable: true },
    { name: "Cycle", selector: (row) => row.cycleName || "N/A", sortable: true },
    { name: "Financial Year", selector: (row) => row.financialYear || "N/A", sortable: true },
    {
      name: "Status",
      selector: (row) => row.status || "Pending",
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "Completed"
              ? "bg-success bg-opacity-10 text-success"
              : "bg-warning bg-opacity-10 text-warning"
          }`}
        >
          {row.status || "Pending"}
        </span>
      ),
      sortable: true,
    },
    { name: "Overall Score", selector: (row) => row.overallSelfScore?.toFixed(2) || 0, sortable: true },
  ];

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
                  <h4 className="mb-0 text-dark">Unit Appraisals</h4>
                  <small className="text-muted">Total: {appraisals.length} Appraisals</small>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => downloadCSV(filteredAppraisals)}
                >
                  <i className="bi bi-download me-1"></i> Export CSV
                </button>
              </div>
            }
          >
            {/* 🔹 Search input above table */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by code, name, cycle, year, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredAppraisals.length > 0 ? (
              <DataTable columns={columns} data={filteredAppraisals} pagination highlightOnHover dense />
            ) : loading ? null : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-journal-text display-1 mb-3"></i>
                <h5>No Appraisals Found</h5>
                <p>There are currently no appraisal records available.</p>
              </div>
            )}
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default UnitAppraisal;
