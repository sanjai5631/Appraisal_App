import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

const ViewAppraisal = () => {
  const [appraisal, setAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // get token

  // Get appraisalId from URL query parameter as fallback
  const query = new URLSearchParams(location.search);
  const appraisalId = query.get("appraisalId") || location.state?.appraisalId;

  useEffect(() => {
    if (!appraisalId) return;

    axios
      .get("https://localhost:7098/api/SelfAppraisal/GetAppraisalById", {
        params: { appraisalId },
        headers: { Authorization: `Bearer ${token}` }, // added auth header
      })
      .then((res) => {
        // Pick the first element since API returns an array
        setAppraisal(res.data.data?.[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appraisal:", err);
        setLoading(false);
      });
  }, [appraisalId, token]);

  if (loading) return <p>Loading appraisal...</p>;
  if (!appraisal) return <p>No appraisal found.</p>;

  return (
    <CardWrapper title="View Appraisal">
      <div className="d-flex justify-content-between">
        <div className="mb-4 border border-primary p-4">
          <h5>Employee Details</h5>
          <p><strong>Name:</strong> {appraisal.employeeName || "-"}</p>
          <p><strong>Unit:</strong> {appraisal.unitName || "-"}</p>
          <p><strong>Cycle:</strong> {appraisal.cycleName || "-"}</p>
          <p><strong>Status:</strong> {appraisal.status || "-"}</p>
          <p><strong>Final Rating:</strong> {appraisal.finalRating || "-"}</p>
        </div>

        <div className="mb-4 border border-primary p-4">
          <h5>Overall Scores & Comments</h5>
          <p><strong>Self Score:</strong> {appraisal.overallSelfScore ?? "-"}</p>
          <p><strong>Supervisor Score:</strong> {appraisal.overallSupervisorScore ?? "-"}</p>
          <p><strong>Associate Comment:</strong> {appraisal.overallAssociateComment || "-"}</p>
          <p><strong>Supervisor Comment:</strong> {appraisal.overallSupervisorComment || "-"}</p>
        </div>
      </div>

      <div>
        <h5>KPI Responses</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>KPI</th>
              <th>Self Score</th>
              <th>Supervisor Score</th>
              <th>Associate Comment</th>
              <th>Supervisor Comment</th>
            </tr>
          </thead>
          <tbody>
            {appraisal.kpiResponses?.length > 0 ? (
              appraisal.kpiResponses.map((kpi, index) => (
                <tr key={index}>
                  <td>{kpi.kpiName || "-"}</td>
                  <td>{kpi.selfScore ?? "-"}</td>
                  <td>{kpi.supervisorScore ?? "-"}</td>
                  <td>{kpi.associateComment || "-"}</td>
                  <td>{kpi.supervisorComment || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No KPI responses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </CardWrapper>
  );
};

export default ViewAppraisal;
