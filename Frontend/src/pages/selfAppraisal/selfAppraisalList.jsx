import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import axios from "axios";

const statusBadge = (status) => {
    switch (status) {
        case "Start":
            return <span className="badge bg-primary bg-opacity-10 text-primary">Start</span>;
        case "In Progress":
            return <span className="badge bg-warning bg-opacity-10 text-warning">In Progress</span>;
        case "Supervisor Reviewed":
            return <span className="badge bg-info bg-opacity-10 text-info">Supervisor Reviewed</span>;
        case "Completed":
            return <span className="badge bg-success bg-opacity-10 text-success">Completed</span>;
        default:
            return <span className="badge bg-secondary bg-opacity-10 text-secondary">{status}</span>;
    }
};

function SelfAppraisalList() {
    const navigate = useNavigate();
    const [appraisalList, setAppraisalList] = useState([]);

    // Fetch self-appraisal cycles for logged-in employee
    const fetchAppraisal = async () => {
        try {
            // get employeeId from JWT/localStorage
            const employeeId = localStorage.getItem("employeeId");

            const res = await axios.get(
                `https://localhost:7098/api/SelfAppraisal/GetAllSelfAppraisal?employeeId=${employeeId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (res.data?.data) {
                setAppraisalList(res.data.data);
            } else {
                setAppraisalList([]);
            }
        } catch (error) {
            console.error("Error fetching appraisal list:", error);
            setAppraisalList([]);
        }
    };

    useEffect(() => {
        fetchAppraisal();
    }, []);

    // Navigate depending on status
    const handleAction = (item) => {
        const empId =localStorage.getItem("employeeId");
        navigate("/self-appraisal-form", { state: { appraisalData: item,empId:empId} });
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-12">
                    <CardWrapper
                        variant="default"
                        hover={true}
                        header={
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h4 className="mb-0 text-dark">Self Appraisal Cycles</h4>
                                    <small className="text-muted">Total: {appraisalList.length} Cycles</small>
                                </div>
                            </div>
                        }
                    >
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Financial Year</th>
                                        <th>Cycle</th>
                                        <th>Start Date</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appraisalList.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                No self appraisal cycles found.
                                            </td>
                                        </tr>
                                    ) : (
                                        appraisalList.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <span className="badge bg-primary bg-opacity-10 text-primary">
                                                        {item.financialYearName}
                                                    </span>
                                                </td>
                                                <td>{item.cycleName}</td>
                                                <td>{new Date(item.publishDate).toLocaleDateString()}</td>
                                                <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                                                <td>{statusBadge(item.status)}</td>
                                                <td className="text-center">
                                                    <button
                                                        className={`btn btn-sm ${item.status === "Start" ? "btn-success" : "btn-outline-primary"
                                                            }`}
                                                        onClick={() => handleAction(item)}
                                                    >
                                                        {item.status === "Start" ? (
                                                            <>
                                                                <i className="bi bi-pencil-square me-1"></i>
                                                                Fill Form
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-eye me-1"></i>
                                                                View
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardWrapper>
                </div>
            </div>
        </div>
    );
}

export default SelfAppraisalList;
