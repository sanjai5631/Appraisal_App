import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

const SelfAppraisalForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { appraisalData, empId, viewMode, appraisalId } = location.state || {};
    const isViewMode = !!viewMode;

    const [userRole] = useState(localStorage.getItem("role") || "employee");
    const [formData, setFormData] = useState([]);
    const [templateId, setTemplateId] = useState(appraisalData?.templateId || null);
    const [overallAssociateComment, setOverallAssociateComment] = useState("");
    const [overallSupervisorComment, setOverallSupervisorComment] = useState("");
    const [totalScore, setTotalScore] = useState(0);
    const [totalWeightage, setTotalWeightage] = useState(0);
    const [overallSupervisorScore, setOverallSupervisorScore] = useState(0);
    const [finalRating, setFinalRating] = useState(appraisalData?.finalRating || ""); // NEW

    // Fetch template & KPI data
    const fetchForm = async () => {
        try {
            const departmentId = localStorage.getItem("deptId") || 0;
            if (!departmentId) return;

            const res = await axios.get(
                `https://localhost:7098/api/AppraisalForm/GetTemplateByDeptId?departmentId=${departmentId}&employeeId=${empId}&cycleId=${appraisalData?.cycleId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (res.data?.data) {
                const kpis = Array.isArray(res.data.data.kpis) ? res.data.data.kpis : [];
                setFormData(kpis);
                setOverallAssociateComment(res.data.data.overallAssociateComment || "");
                setOverallSupervisorComment(res.data.data.overallSupervisorComment || "");
                if (!templateId && res.data.data.templateId) setTemplateId(res.data.data.templateId);
                if (res.data.data.finalRating) setFinalRating(res.data.data.finalRating);
            } else setFormData([]);
        } catch (error) {
            console.error("Error fetching template:", error);
            setFormData([]);
        }
    };

    useEffect(() => {
        fetchForm();
    }, []);

    // Recalculate overall scores whenever formData changes
    useEffect(() => {
        const totalWeight = formData.reduce((sum, item) => sum + (item.kpiWeightage || 0), 0);

        const totalWeightedScore = formData.reduce((sum, item) => {
            if (userRole === "manager" || userRole === "supervisor") {
                return sum + ((item.supervisorScore || 0) / 5) * (item.kpiWeightage || 0);
            } else {
                return sum + ((item.agileScore || 0) / 5) * (item.kpiWeightage || 0);
            }
        }, 0);

        const totalSupervisor = formData.reduce((sum, item) => sum + (item.supervisorScore || 0), 0);

        setTotalWeightage(totalWeight);
        setTotalScore(totalWeightedScore);
        setOverallSupervisorScore(totalSupervisor);
    }, [formData, userRole]);

    const handleScoreChange = (kpiId, value, type = "agile") => {
        if (isViewMode) return;
        const numericValue = parseFloat(value) || 0;
        if (numericValue < 0 || numericValue > 5) return;

        setFormData(prev =>
            prev.map(item =>
                item.kpiId === kpiId
                    ? { ...item, [type === "agile" ? "agileScore" : "supervisorScore"]: numericValue }
                    : item
            )
        );
    };

    const handleCommentChange = (kpiId, value, type = "associate") => {
        if (isViewMode) return;
        setFormData(prev =>
            prev.map(item =>
                item.kpiId === kpiId
                    ? { ...item, [type === "associate" ? "associateComment" : "supervisorComment"]: value }
                    : item
            )
        );
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

    // CSV export
    const downloadCSV = () => {
        if (!formData.length) return;
        const headers = ["KPI ID", "KPI Title", "Description", "Weightage", "Agile Score", "Supervisor Score", "Associate Comment", "Supervisor Comment"];
        const rows = formData.map(item => [
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

    // Submit
    const handleSubmit = async () => {
        if (isViewMode) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to submit this appraisal?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, submit",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {
            const employeeId = appraisalData?.employeeId || parseInt(localStorage.getItem("employeeId"));
            const cycleId = appraisalData?.cycleId;

            if (!employeeId || !cycleId) {
                Swal.fire({
                    icon: "warning",
                    title: "Missing Data",
                    text: "Employee or cycle data is missing."
                });
                return;
            }

            const kpiResponses = formData.map(item => ({
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
                overallSelfScore: formData.reduce((sum, i) => sum + (i.agileScore || 0), 0).toFixed(2),
                overallSupervisorScore: overallSupervisorScore.toFixed(2),
                finalRating, // <--- INCLUDED
                status: appraisalId ? "Completed" : "Submitted",
                createdBy: parseInt(localStorage.getItem("employeeId")),
                kpiResponses,
                overallAssociateComment,
                overallSupervisorComment
            };

            const res = appraisalId
                ? await axios.put(`https://localhost:7098/api/Appraisal/UpdateAppraisal?appraisalId=${appraisalId}`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
                : await axios.post("https://localhost:7098/api/Appraisal/SubmitSelfAppraisal", payload, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

            if (res.data?.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Appraisal submitted successfully!",
                    confirmButtonText: "OK"
                }).then(() => navigate("/self-appraisal-list"));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Submission Failed",
                    text: res.data?.message || "Something went wrong while submitting appraisal."
                });
            }
        } catch (error) {
            console.error("Error submitting appraisal:", error.response?.data || error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong while submitting appraisal."
            });
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
                            <div className="col-md-6 mb-3">
                                <div className={`card border-${scoreGrade.color}`}>
                                    <div className={`card-body text-center text-${scoreGrade.color}`}>
                                        <h5 className="card-title">Overall Score</h5>
                                        <h2 className="mb-0">{totalScore.toFixed(2)}</h2>
                                        <small className="text-muted">Out of {totalWeightage}</small>
                                        <div className={`badge bg-${scoreGrade.color} mt-2`}>{scoreGrade.grade}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="card border-info">
                                    <div className="card-body text-center text-info">
                                        <h5 className="card-title">Overall Supervisor Score</h5>
                                        <h2 className="mb-0">{overallSupervisorScore.toFixed(2)}</h2>
                                        <small className="text-muted">Out of {formData.length * 5}</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Rating - Manager/Supervisor only */}
                        {(userRole === "manager" || userRole === "supervisor") && (
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-header bg-light">
                                            <h6>Final Rating</h6>
                                        </div>
                                        <div className="card-body">
                                            <select
                                                className="form-select"
                                                value={finalRating}
                                                onChange={(e) => setFinalRating(e.target.value)}
                                                disabled={isViewMode}
                                            >
                                                <option value="">-- Select Final Rating --</option>
                                                <option value="E">E (Excellent)</option>
                                                <option value="EE">EE (Exceeds Expectations)</option>
                                                <option value="ME">ME (Meets Expectations)</option>
                                                <option value="MEWE">MEWE (Meets Expectations with some Exceptions)</option>
                                                <option value="NME">NME (Not Meeting Expectations)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


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
                                    {formData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{item.kpiId}</td>
                                            <td>{item.kpiTitle}</td>
                                            <td>{item.kpiDescription}</td>
                                            <td className="text-center">{item.kpiWeightage}%</td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0" max="5" step="0.01"
                                                    value={item.agileScore || 0}
                                                    onChange={(e) => handleScoreChange(item.kpiId, e.target.value, "agile")}
                                                    readOnly={isViewMode || userRole === "manager" || userRole === "supervisor"}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0" max="5" step="0.01"
                                                    value={item.supervisorScore || 0}
                                                    onChange={(e) => handleScoreChange(item.kpiId, e.target.value, "supervisor")}
                                                    disabled={isViewMode || !(userRole === "manager" || userRole === "supervisor")}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    value={item.associateComment || ""}
                                                    onChange={(e) => handleCommentChange(item.kpiId, e.target.value, "associate")}
                                                    readOnly={isViewMode || userRole === "manager" || userRole === "supervisor"}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    value={item.supervisorComment || ""}
                                                    onChange={(e) => handleCommentChange(item.kpiId, e.target.value, "supervisor")}
                                                    disabled={isViewMode || !(userRole === "manager" || userRole === "supervisor")}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Overall Comments & Final Rating */}
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6>Overall Associate Comments</h6>
                                    </div>
                                    <div className="card-body">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={overallAssociateComment}
                                            onChange={(e) => setOverallAssociateComment(e.target.value)}
                                            readOnly={isViewMode || userRole === "manager" || userRole === "supervisor"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6>Overall Supervisor Comments</h6>
                                    </div>
                                    <div className="card-body">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={overallSupervisorComment}
                                            onChange={(e) => setOverallSupervisorComment(e.target.value)}
                                            disabled={isViewMode || !(userRole === "manager" || userRole === "supervisor")}
                                        />
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
