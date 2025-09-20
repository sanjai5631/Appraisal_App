import React from "react";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

const selfAppraisalData = [
    {
        id: 1,
        financialYear: "2023-2024",
        cycle: "Mid-Year",
        startDate: "2023-10-01",
        dueDate: "2023-10-31",
        status: "Start",
    },
    {
        id: 2,
        financialYear: "2023-2024",
        cycle: "Year-End",
        startDate: "2024-03-01",
        dueDate: "2024-03-31",
        status: "In Progress",
    },
    {
        id: 3,
        financialYear: "2022-2023",
        cycle: "Year-End",
        startDate: "2023-03-01",
        dueDate: "2023-03-31",
        status: "Supervisor Reviewed",
    },
    {
        id: 4,
        financialYear: "2021-2022",
        cycle: "Year-End",
        startDate: "2022-03-01",
        dueDate: "2022-03-31",
        status: "Completed",
    },
];

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

    const handleAction = (item) => {
        if (item.status === "Start") {
            navigate("/self-appraisal-form", { state: { appraisalData: item } });
        } else {
            navigate("/self-appraisal-view", { state: { appraisalData: item } });
        }
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
                                    <small className="text-muted">Total: {selfAppraisalData.length} Cycles</small>
                                </div>
                            </div>
                        }
                    >
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="fw-semibold">
                                            <i className="bi bi-calendar-range me-1"></i>
                                            Financial Year
                                        </th>
                                        <th scope="col" className="fw-semibold">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            Cycle
                                        </th>
                                        <th scope="col" className="fw-semibold">
                                            <i className="bi bi-calendar-check me-1"></i>
                                            Start Date
                                        </th>
                                        <th scope="col" className="fw-semibold">
                                            <i className="bi bi-calendar-x me-1"></i>
                                            Due Date
                                        </th>
                                        <th scope="col" className="fw-semibold">
                                            <i className="bi bi-toggle-on me-1"></i>
                                            Status
                                        </th>
                                        <th scope="col" className="fw-semibold text-center">
                                            <i className="bi bi-gear me-1"></i>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selfAppraisalData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                No self appraisal cycles found.
                                            </td>
                                        </tr>
                                    ) : (
                                        selfAppraisalData.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <span className="badge bg-primary bg-opacity-10 text-primary">
                                                        {item.financialYear}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="fw-medium">{item.cycle}</span>
                                                </td>
                                                <td>
                                                    <span className="text-muted">
                                                        {new Date(item.startDate).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-muted">
                                                        {new Date(item.dueDate).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td>{statusBadge(item.status)}</td>
                                                <td className="text-center">
                                                    <button
                                                        className={`btn btn-sm ${item.status === "Start"
                                                            ? "btn-success"
                                                            : "btn-outline-primary"
                                                            }`}
                                                        onClick={() => handleAction(item)}
                                                        title={
                                                            item.status === "Start"
                                                                ? "Fill Appraisal Form"
                                                                : "View Appraisal"
                                                        }
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
