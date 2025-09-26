import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

const SelfAppraisalForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    appraisalData,
    empId,
    viewMode,
    kpiResponses,
    supervisorScore,
    supervisorComment,
  } = location.state || {};
  const isViewMode = !!viewMode;

  const [userRole] = useState(localStorage.getItem("role") || "employee");
  const [formData, setFormData] = useState([]);
  const [templateId, setTemplateId] = useState(appraisalData?.templateId || null);
  const [overallAssociateComment, setOverallAssociateComment] = useState("");
  const [overallSupervisorComment, setOverallSupervisorComment] = useState(supervisorComment || "");
  const [totalWeightage, setTotalWeightage] = useState(0);
  const [overallSelfScore, setOverallSelfScore] = useState(0);
  const [overallSupervisorScore, setOverallSupervisorScore] = useState(supervisorScore || 0);
  const [finalRating, setFinalRating] = useState(appraisalData?.finalRating || "");
  const [loading, setLoading] = useState(false);
  const [appraisalId, setAppraisalId] = useState(appraisalData?.appraisalId || null);

  const employeeId = parseInt(localStorage.getItem("employeeId"));

  // Grade calculation
  const getScoreGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A+", color: "success" };
    if (percentage >= 80) return { grade: "A", color: "success" };
    if (percentage >= 70) return { grade: "B+", color: "warning" };
    if (percentage >= 60) return { grade: "B", color: "warning" };
    if (percentage >= 50) return { grade: "C", color: "info" };
    return { grade: "D", color: "danger" };
  };

  // Fetch KPI template and previous responses
  const fetchForm = async () => {
    try {
      const departmentId = localStorage.getItem("deptId") || 0;
      if (!departmentId) return;

      setLoading(true);
      const res = await axios.get(
        `https://localhost:7098/api/AppraisalForm/GetTemplateByDeptId?departmentId=${departmentId}&employeeId=${empId}&cycleId=${appraisalData?.cycleId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data?.data) {
        const kpis = Array.isArray(res.data.data.kpis) ? res.data.data.kpis : [];
        setFormData(kpis);
        setOverallAssociateComment(res.data.data.overallAssociateComment || "");
        setOverallSupervisorComment(res.data.data.overallSupervisorComment||"");
        if (!templateId && res.data.data.templateId) setTemplateId(res.data.data.templateId);
        if (res.data.data.finalRating) setFinalRating(res.data.data.finalRating);
      } else {
        setFormData([]);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      setFormData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize form data
  useEffect(() => {
    if (isViewMode && kpiResponses) {
      setFormData(kpiResponses);
    } else {
      fetchForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId, appraisalData?.cycleId, isViewMode]);

  // Calculate overall scores
  useEffect(() => {
    const totalWeight = formData.reduce((sum, item) => sum + (item.kpiWeightage || 0), 0);
    const totalSelf = formData.reduce(
      (sum, item) => sum + ((item.agileScore || 0) / 5) * (item.kpiWeightage || 0),
      0
    );
    const totalSupervisor = formData.reduce(
      (sum, item) => sum + ((item.supervisorScore || 0) / 5) * (item.kpiWeightage || 0),
      0
    );

    setTotalWeightage(totalWeight);
    setOverallSelfScore(totalSelf);
    setOverallSupervisorScore(totalSupervisor);
  }, [formData]);

  // Handle score and comment changes
  const handleScoreChange = (kpiId, value, type = "agile") => {
    if (isViewMode) return;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 5) return;

    setFormData((prev) =>
      prev.map((item) =>
        item.kpiId === kpiId
          ? { ...item, [type === "agile" ? "agileScore" : "supervisorScore"]: numericValue }
          : item
      )
    );
  };

  const handleCommentChange = (kpiId, value, type = "associate") => {
    if (isViewMode) return;
    setFormData((prev) =>
      prev.map((item) =>
        item.kpiId === kpiId
          ? { ...item, [type === "associate" ? "associateComment" : "supervisorComment"]: value }
          : item
      )
    );
  };

useEffect(() => {
  if (isViewMode && kpiResponses) {
    setFormData(
      kpiResponses.map(item => ({
        kpiId: item.kpiId,
        kpiTitle: item.kpiName || "",        // map kpiName → kpiTitle
        kpiDescription: item.kpiDescription || "",
        kpiWeightage: item.kpiWeightage || 0,
        agileScore: item.selfScore || 0,     // map selfScore → agileScore
        supervisorScore: item.supervisorScore || 0,
        associateComment: item.associateComment || "",
        supervisorComment: item.supervisorComment || "",
        responseId: item.responseId || null,  // if your API provides responseId
      }))
    );
  } else {
    fetchForm();
  }
}, []);



  // Validation before submit
  const validateForm = () => {
    for (let item of formData) {
      if (userRole === "employee" && item.agileScore === undefined) {
        Swal.fire("Validation Error", "All Agile Scores are required.", "warning");
        return false;
      }
      if ((userRole === "manager" || userRole === "supervisor") && item.supervisorScore === undefined) {
        Swal.fire("Validation Error", "All Supervisor Scores are required.", "warning");
        return false;
      }
      if (userRole === "employee" && !item.associateComment) {
        Swal.fire("Validation Error", "Associate Comments are required.", "warning");
        return false;
      }
      if ((userRole === "manager" || userRole === "supervisor") && !item.supervisorComment) {
        Swal.fire("Validation Error", "Supervisor Comments are required.", "warning");
        return false;
      }
    }

    if (userRole === "employee" && !overallAssociateComment) {
      Swal.fire("Validation Error", "Overall Associate Comment is required.", "warning");
      return false;
    }

    if ((userRole === "manager" || userRole === "supervisor") && (!overallSupervisorComment || !finalRating)) {
      Swal.fire("Validation Error", "Overall Supervisor Comment and Final Rating are required.", "warning");
      return false;
    }

    return true;
  };

  // Submit appraisal
  const handleSubmit = async () => {
    if (isViewMode || !validateForm()) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this appraisal?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const cycleId = appraisalData?.cycleId;

      const kpiResponsesPayload = formData.map((item) => ({
        responseId: item.responseId,
        kpiId: item.kpiId,
        selfScore: item.agileScore || 0,
        supervisorScore: item.supervisorScore || 0,
        associateComment: item.associateComment ?? "",
        supervisorComment: item.supervisorComment ?? "",
      }));

      const payload = {
        appraisalId,
        employeeId: appraisalData?.employeeId || employeeId,
        cycleId,
        templateId,
        status: userRole === "employee" ? "Submitted" : "Completed",
        kpiResponses: kpiResponsesPayload,
        createdBy: employeeId,
        overallAssociateComment,
        overallSupervisorComment,
        finalRating,
        overallSelfScore,
        overallSupervisorScore,
      };

      const res = await axios.post(
        "https://localhost:7098/api/Appraisal/SubmitSelfAppraisal",
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data?.statusCode === 200) {
        Swal.fire("Success!", "Appraisal submitted successfully!", "success").then(() =>
          navigate("/self-appraisal-list")
        );
      } else {
        Swal.fire("Submission Failed", res.data?.message || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error submitting appraisal:", error.response?.data || error);
      Swal.fire("Error", error.response?.data?.message || "Something went wrong.", "error");
    }
  };

  // Export CSV
  const downloadCSV = () => {
    if (!formData.length) return;

    const headers = [
      "KPI ID",
      "KPI Title",
      "Description",
      "Weightage",
      "Agile Score",
      "Supervisor Score",
      "Associate Comment",
      "Supervisor Comment",
    ];
    const rows = formData.map((item) => [
      item.kpiId,
      item.kpiTitle || "",
      item.kpiDescription || "",
      item.kpiWeightage,
      item.agileScore,
      item.supervisorScore,
      item.associateComment || "",
      item.supervisorComment || "",
    ]);

    rows.push([
      "Overall",
      "",
      "",
      totalWeightage,
      overallSelfScore.toFixed(2),
      overallSupervisorScore.toFixed(2),
      overallAssociateComment,
      overallSupervisorComment,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "self_appraisal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selfPercentage = totalWeightage > 0 ? (overallSelfScore / totalWeightage) * 100 : 0;
  const supervisorPercentage = totalWeightage > 0 ? (overallSupervisorScore / totalWeightage) * 100 : 0;
  const selfGrade = getScoreGrade(selfPercentage);

  if (loading) return <p>Loading appraisal form...</p>;

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
                  <h4 className="mb-0 text-dark">Self Appraisal Form</h4>
                  <small className="text-muted">
                    {appraisalData?.financialYear} - {appraisalData?.cycle}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/self-appraisal-list")}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to List
                  </button>
                  {!isViewMode && (
                    <button className="btn btn-success btn-sm" onClick={handleSubmit}>
                      <i className="bi bi-check-circle me-1"></i> Submit Appraisal
                    </button>
                  )}
                  <button className="btn btn-outline-success btn-sm" onClick={downloadCSV}>
                    <FaDownload className="me-1" /> Export CSV
                  </button>
                </div>
              </div>
            }
          >
            {/* Overall Score Cards */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className={`card border-${selfGrade.color}`}>
                  <div className={`card-body text-center text-${selfGrade.color}`}>
                    <h5 className="card-title">Employee Self Score</h5>
                    <h2 className="mb-0">{selfPercentage.toFixed(2)}</h2>
                    <small className="text-muted">Out of 100</small>
                    <div className={`badge bg-${selfGrade.color} mt-2`}>{selfGrade.grade}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card border-info">
                  <div className="card-body text-center text-info">
                    <h5 className="card-title">Manager Score</h5>
                    <h2 className="mb-0">{supervisorPercentage.toFixed(2)}</h2>
                    <small className="text-muted">Out of 100</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Rating */}
            <div className="mb-3">
              <label className="form-label fw-bold">Final Rating</label>
              {isViewMode ? (
                <p className="form-control-plaintext">{finalRating || "-"}</p>
              ) : (
                (userRole === "manager" || userRole === "supervisor") && (
                  <select
                    className="form-select"
                    required
                    value={finalRating}
                    onChange={(e) => setFinalRating(e.target.value)}
                  >
                    <option value="">-- Select Final Rating --</option>
                    <option value="E (Excellent)">E (Excellent)</option>
                    <option value="EE (Exceeds Expectations)">EE (Exceeds Expectations)</option>
                    <option value="ME (Meets Expectations)">ME (Meets Expectations)</option>
                    <option value="MEWE (Meets with Exceptions)">MEWE (Meets with Exceptions)</option>
                    <option value="NME (Not Meeting Expectations)">NME (Not Meeting Expectations)</option>
                  </select>
                )
              )}
            </div>

            {/* KPI Table */}
            <div className="table-responsive mt-3">
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Job Proficiency</th>
                    <th>Description</th>
                    <th>Weightage</th>
                    <th>Agile Score</th>
                    <th>Supervisor Score</th>
                    <th>Associate Comment</th>
                    <th>Supervisor Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.kpiId}</td>
                      <td>{item.kpiTitle}</td>
                      <td>{item.kpiDescription}</td>
                      <td>{item.kpiWeightage}%</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          max="5"
                          value={item.agileScore || ""}
                          onChange={(e) => handleScoreChange(item.kpiId, e.target.value, "agile")}
                          readOnly={isViewMode || userRole !== "employee"}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          max="5"
                          step="0.1"
                          value={item.supervisorScore || ""}
                          onChange={(e) => handleScoreChange(item.kpiId, e.target.value, "supervisor")}
                          readOnly={isViewMode || !(userRole === "manager" || userRole === "supervisor")}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          value={item.associateComment || ""}
                          onChange={(e) => handleCommentChange(item.kpiId, e.target.value, "associate")}
                          readOnly={isViewMode || userRole !== "employee"}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          value={item.supervisorComment || ""}
                          onChange={(e) => handleCommentChange(item.kpiId, e.target.value, "supervisor")}
                          readOnly={isViewMode || !(userRole === "manager" || userRole === "supervisor")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Overall Comments */}
            <div className="row mt-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Overall Associate Comments *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={overallAssociateComment}
                  onChange={(e) => setOverallAssociateComment(e.target.value)}
                  readOnly={isViewMode || userRole !== "employee"}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Overall Supervisor Comments *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={overallSupervisorComment}
                  onChange={(e) => setOverallSupervisorComment(e.target.value)}
                  readOnly={isViewMode || !(userRole === "manager" || userRole === "supervisor")}
                />
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default SelfAppraisalForm;
