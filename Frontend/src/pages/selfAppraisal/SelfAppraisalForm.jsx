import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

const SelfAppraisalForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { appraisalData, empId, viewMode, appraisalId } = location.state || {};
    const isViewMode = !!viewMode;

    const [userRole] = useState(localStorage.getItem("role") || "employee");
    const [formdata, setFormData] = useState([]);
    const [templateId, setTemplateId] = useState(appraisalData?.templateId || null);
    const [overallAssociateComment, setOverallAssociateComment] = useState("");
    const [overallSupervisorComment, setOverallSupervisorComment] = useState("");
    const [totalScore, setTotalScore] = useState(0);
    const [totalWeightage, setTotalWeightage] = useState(0);

    // Fetch template & KPI data
    const fetchForm = async () => {
        try {
            const departmentId = localStorage.getItem("deptId") || 0;
            if (!departmentId) return;

            const res = await axios.get(
                `https://localhost:7098/api/AppraisalForm/GetTemplateByDeptId?departmentId=${departmentId}&employeeId=${empId}&cycleId=${appraisalData.cycleId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (res.data?.data) {
                const kpis = Array.isArray(res.data.data.kpis) ? res.data.data.kpis : [];
                setFormData(kpis);
                setOverallAssociateComment(res.data.data.overallAssociateComment || "");
                setOverallSupervisorComment(res.data.data.overallSupervisorComment || "");
                if (!templateId && res.data.data.templateId) setTemplateId(res.data.data.templateId);
            } else setFormData([]);
        } catch (error) {
            console.error("Error fetching template:", error);
            setFormData([]);
        }
    };

    useEffect(() => { fetchForm(); }, []);
    useEffect(() => { calculateTotalScore(); }, [formdata]);

    const calculateTotalScore = () => {
        const totalWeightedScore = formdata.reduce(
            (sum, item) => sum + ((item.agileScore / 5) * item.kpiWeightage),
            0
        );
        const totalWeight = formdata.reduce((sum, item) => sum + item.kpiWeightage, 0);
        setTotalWeightage(totalWeight);
        setTotalScore(totalWeightedScore);
    };

    const handleScoreChange = (kpiId, value, type = "agile") => {
        if (isViewMode) return;
        const numericValue = parseFloat(value) || 0;
        if (numericValue < 0 || numericValue > 5) return;

        setFormData(formdata.map(item =>
            item.kpiId === kpiId
                ? { ...item, [type === "agile" ? "agileScore" : "supervisorScore"]: numericValue }
                : item
        ));
    };

    const handleCommentChange = (kpiId, value, type = "associate") => {
        if (isViewMode) return;
        setFormData(formdata.map(item =>
            item.kpiId === kpiId
                ? { ...item, [type === "associate" ? "associateComment" : "supervisorComment"]: value }
                : item
        ));
    };

    const getScorePercentage = () => (totalWeightage > 0 ? ((totalScore / totalWeightage) * 100).toFixed(2) : 0);
    const getScoreGrade = (percentage) => {
        if (percentage >= 90) return { grade: "A+", color: "success" };
        if (percentage >= 80) return { grade: "A", color: "success" };
        if (percentage >= 70) return { grade: "B+", color: "warning" };
        if (percentage >= 60) return { grade: "B", color: "warning" };
        if (percentage >= 50) return { grade: "C", color: "info" };
        return { grade: "D", color: "danger" };
    };

    // ---------------- CSV Export ----------------
    const downloadCSV = () => {
        if (!formdata.length) return;
        const headers = ["KPI ID", "KPI Title", "Description", "Weightage", "Agile Score", "Supervisor Score", "Associate Comment", "Supervisor Comment"];
        const rows = formdata.map(item => [
            item.kpiId,
            `"${item.kpiTitle}"`,
            `"${item.kpiDescription}"`,
            item.kpiWeightage,
            item.agileScore,
            item.supervisorScore,
            `"${item.associateComment ?? ""}"`,
            `"${item.supervisorComment ?? ""}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "self_appraisal.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async () => {
        if (isViewMode) return;

        try {
            const employeeId = appraisalData?.employeeId || parseInt(localStorage.getItem("employeeId"));
            const cycleId = appraisalData?.cycleId;
            if (!employeeId || !cycleId) return alert("Employee or cycle data is missing.");

            const kpiResponses = formdata.map(item => ({
                responseId: item.responseId,
                kpiId: item.kpiId,
                selfScore: item.agileScore || 0,
                supervisorScore: item.supervisorScore || 0,
                associateComment: item.associateComment ?? "",
                supervisorComment: item.supervisorComment ?? ""
            }));

            const payload = {
                employeeId,
                cycleId,
                templateId,
                overallSelfScore: totalScore.toFixed(2),
                overallSupervisorScore: formdata.reduce((sum, i) => sum + (i.supervisorScore || 0), 0).toFixed(2),
                finalRating: "",
                status: appraisalId ? "Completed" : "Submitted",
                createdBy: parseInt(localStorage.getItem("employeeId")),
                kpiResponses,
                overallAssociateComment,
                overallSupervisorComment
            };

            let res;
            if (appraisalId) {
                res = await axios.put(
                    `https://localhost:7098/api/Appraisal/UpdateAppraisal?appraisalId=${appraisalId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                res = await axios.post(
                    "https://localhost:7098/api/Appraisal/SubmitSelfAppraisal",
                    payload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }

            if (res.data?.statusCode === 200) {
                alert("Appraisal submitted successfully!");
                navigate("/self-appraisal-list");
            } else {
                alert("Failed to submit appraisal: " + res.data?.message);
            }
        } catch (error) {
            console.error("Error submitting appraisal:", error.response?.data || error);
            alert(error.response?.data?.message || "Something went wrong while submitting appraisal.");
        }
    };

    const scoreGrade = getScoreGrade(getScorePercentage());

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
                                    <h4 className="mb-0 text-dark">Self Appraisal Form</h4>
                                    <small className="text-muted">{appraisalData?.financialYear} - {appraisalData?.cycle}</small>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/self-appraisal-list")}>
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
                        {/* Score Summary */}
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className={`card border-${scoreGrade.color}`}>
                                    <div className={`card-body text-center text-${scoreGrade.color}`}>
                                        <h5 className="card-title">Overall Score</h5>
                                        <h2 className="mb-0">{totalScore.toFixed(2)}</h2>
                                        <small className="text-muted">Out of {totalWeightage}</small>
                                        <div className={`badge bg-${scoreGrade.color} mt-2`}>{scoreGrade.grade}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KPI Table */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Job Proficiency</th>
                                        <th>Description</th>
                                        <th className="text-center">Weightage</th>
                                        <th className="text-center">Agile Score (0-5)</th>
                                        <th className="text-center">Supervisor Score (0-5)</th>
                                        <th>Associate Comment</th>
                                        <th>Supervisor Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formdata.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center"><span className="badge bg-info bg-opacity-10 text-info">{item.kpiId}</span></td>
                                            <td><span className="fw-medium">{item.kpiTitle}</span></td>
                                            <td><small className="text-muted">{item.kpiDescription}</small></td>
                                            <td className="text-center"><span className="badge bg-info bg-opacity-10 text-info">{item.kpiWeightage}%</span></td>
                                            <td className="text-center">
                                                <input type="number" className="form-control form-control-sm" min="0" max="5" step="0.01" value={item.agileScore} onChange={(e) => handleScoreChange(item.kpiId, e.target.value, "agile")} placeholder="0.00" readOnly={isViewMode} />
                                            </td>
                                            <td className="text-center">
                                                <input type="number" className="form-control form-control-sm" min="0" max="5" step="0.01" value={item.supervisorScore} onChange={(e) => handleScoreChange(item.kpiId, e.target.value, "supervisor")} placeholder="0.00" disabled={isViewMode || (userRole !== "supervisor" && userRole !== "manager")} />
                                            </td>
                                            <td>
                                                <textarea className="form-control form-control-sm" rows="2" value={item.associateComment ?? ""} onChange={(e) => handleCommentChange(item.kpiId, e.target.value, "associate")} readOnly={isViewMode} />
                                            </td>
                                            <td>
                                                <textarea className="form-control form-control-sm" rows="2" value={item.supervisorComment ?? ""} onChange={(e) => handleCommentChange(item.kpiId, e.target.value, "supervisor")} disabled={isViewMode || (userRole !== "supervisor" && userRole !== "manager")} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Overall Comments */}
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0"><i className="bi bi-chat-square-text me-2"></i>Overall Associate Comments</h6>
                                    </div>
                                    <div className="card-body">
                                        <textarea className="form-control" rows="4" value={overallAssociateComment} onChange={(e) => setOverallAssociateComment(e.target.value)} readOnly={isViewMode} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0"><i className="bi bi-person-check me-2"></i>Overall Supervisor Comments</h6>
                                    </div>
                                    <div className="card-body">
                                        <textarea className="form-control" rows="4" value={overallSupervisorComment} onChange={(e) => setOverallSupervisorComment(e.target.value)} disabled={isViewMode || (userRole !== "supervisor" && userRole !== "manager")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardWrapper>
                </div>
            </div>
        </div>
    );
};

export default SelfAppraisalForm;
