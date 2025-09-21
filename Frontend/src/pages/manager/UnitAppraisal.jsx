import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquare, Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import DataTable from "react-data-table-component"; 

const UnitAppraisal = () => {
    const [appraisals, setAppraisals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const employeeId = localStorage.getItem("employeeId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (employeeId) fetchAppraisals();
        else {
            setError("Employee not found. Please login again.");
            setLoading(false);
        }
    }, [employeeId]);

    const fetchAppraisals = async () => {
        try {
            const res = await axios.get(
                `https://localhost:7098/api/SelfAppraisal/GetEmployeeByIId?employeeId=${employeeId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = Array.isArray(res.data.data)
                ? res.data.data
                : res.data?.data
                    ? [res.data.data]
                    : [];

            if (data.length === 0) setError("No appraisals found for this employee.");
            setAppraisals(data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.status === 401
                    ? "Unauthorized. Please login again."
                    : err.response?.status === 404
                        ? "API not found. Check your backend route."
                        : "Failed to fetch employee appraisals."
            );
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = (data) => {
        if (!data?.length) return;
        const headers = ["Emp Code", "Employee Name", "Cycle", "Financial Year", "Status", "Overall Score"];
        const rows = data.map((row) => [
            row.empCode || "",
            row.employeeName || "",
            row.cycleName || "",
            row.financialYear || "",
            row.status || "",
            row.overallSelfScore?.toFixed(2) || 0
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

    const handleReview = async (appraisal) => {
            navigate("/manager-review", { state: { appraisalData: appraisal, empId: appraisal.employeeId,appraisalId:appraisal.appraisalId} });
        } 
    const handleView = (appraisal) => {
        navigate("/dashboard/self-appraisal-form", {
            state: { appraisalData: appraisal, viewMode: true }
        });
    };

    // DataTable columns with icon-only actions (no hover)
    const columns = [
        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-1">
                    <button
                        className="btn btn-outline-success btn-sm p-2"
                        onClick={() => handleReview(row)}
                    >
                        <PencilSquare />
                    </button>
                    <button
                        className="btn btn-outline-info btn-sm p-2"
                        onClick={() => handleView(row)}
                    >
                        <Eye />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: "Emp Code", selector: row => row.empCode || "N/A", sortable: true },
        { name: "Employee Name", selector: row => row.employeeName || "N/A", sortable: true },
        { name: "Cycle", selector: row => row.cycleName || "N/A", sortable: true },
        { name: "Financial Year", selector: row => row.financialYear || "N/A", sortable: true },
        { 
            name: "Status", 
            selector: row => row.status || "Pending",
            cell: row => (
                <span className={`badge ${row.status === "Completed" ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-10 text-warning"}`}>
                    {row.status || "Pending"}
                </span>
            ),
            sortable: true
        },
        { name: "Overall Score", selector: row => row.overallSelfScore?.toFixed(2) || 0, sortable: true },
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
                                <div>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => downloadCSV(appraisals)}
                                    >
                                        <i className="bi bi-download me-1"></i> Export CSV
                                    </button>
                                </div>
                            </div>
                        }
                    >
                        {error ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-exclamation-circle display-1 mb-3"></i>
                                <h5>{error}</h5>
                            </div>
                        ) : appraisals.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-journal-text display-1 mb-3"></i>
                                <h5>No Appraisals Found</h5>
                                <p>There are currently no appraisal records available.</p>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={appraisals}
                                pagination
                                highlightOnHover
                                dense
                            />
                        )}
                    </CardWrapper>
                </div>
            </div>
        </div>
    );
};

export default UnitAppraisal;
