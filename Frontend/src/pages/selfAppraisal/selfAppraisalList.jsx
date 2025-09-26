import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import axios from "axios";

const statusBadge = (status) => {
  const badgeMap = {
    "Start": { text: "Start", className: "bg-primary bg-opacity-10 text-primary" },
    "In Progress": { text: "In Progress", className: "bg-warning bg-opacity-10 text-warning" },
    "Supervisor Reviewed": { text: "Supervisor Reviewed", className: "bg-info bg-opacity-10 text-info" },
    "Completed": { text: "Completed", className: "bg-success bg-opacity-10 text-success" },
  };

  const badge = badgeMap[status] || { text: status, className: "bg-secondary bg-opacity-10 text-secondary" };
  return <span className={`badge ${badge.className}`}>{badge.text}</span>;
};

const SelfAppraisalList = () => {
  const navigate = useNavigate();
  const [appraisalList, setAppraisalList] = useState([]);
  const role = localStorage.getItem("role")?.toLowerCase();
  const employeeId = localStorage.getItem("employeeId");

  // Fetch appraisal list
  const fetchAppraisal = async () => {
    try {
      let url = role === "manager"
        ? `https://localhost:7098/api/SelfAppraisal/GetAppraisalsForManager?managerId=${employeeId}`
        : `https://localhost:7098/api/SelfAppraisal/GetAllSelfAppraisal?employeeId=${employeeId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setAppraisalList(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching appraisal list:", error);
      setAppraisalList([]);
    }
  };

  useEffect(() => { fetchAppraisal(); }, []);

  // Navigate to form or view mode
  const handleAction = (item) => {
    if (role === "manager") {
      // Managers always see in view mode
      navigate("/self-appraisal-form", { state: { appraisalData: item, empId: item.employeeId, viewMode: true } });
    } else {
      const viewMode = item.status !== "Start";
      navigate("/self-appraisal-form", { state: { appraisalData: item, empId: employeeId, viewMode } });
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <CardWrapper
            variant="default"
            hover
            header={
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h4 className="mb-0 text-dark">{role === "manager" ? "Team Appraisals" : "Self Appraisal Cycles"}</h4>
                  <small className="text-muted">Total: {appraisalList.length} Cycles</small>
                </div>
              </div>
            }
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    {role === "manager" && <th>Employee</th>}
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
                      <td colSpan={role === "manager" ? 7 : 6} className="text-center py-4">No appraisal cycles found.</td>
                    </tr>
                  ) : (
                    appraisalList.map((item, index) => (
                      <tr key={index}>
                        {role === "manager" && <td>{item.employeeName}</td>}
                        <td><span className="badge bg-primary bg-opacity-10 text-primary">{item.financialYearName}</span></td>
                        <td>{item.cycleName}</td>
                        <td>{new Date(item.publishDate).toLocaleDateString()}</td>
                        <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                        <td>{statusBadge(item.status)}</td>
                        <td className="text-center">
                          <button
                            className={`btn btn-sm ${
                              role === "employee" && item.status === "Start" ? "btn-success" : "btn-outline-primary"
                            }`}
                            onClick={() => handleAction(item)}
                          >
                            {role === "employee"
                              ? item.status === "Start"
                                ? <><i className="bi bi-pencil-square me-1"></i> Fill Form</>
                                : <><i className="bi bi-eye me-1"></i> View</>
                              : <><i className="bi bi-eye me-1"></i> View</>
                            }
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
};

export default SelfAppraisalList;
