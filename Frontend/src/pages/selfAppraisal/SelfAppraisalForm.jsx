import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";
import axios from "axios";

const SelfAppraisalForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { appraisalData, empId } = location.state;
    const [userRole] = useState(localStorage.getItem("role") || "employee"); // Get user role from localStorage

    // KPI data from API
    const [formdata, setFormData] = useState([]);
    const [templateId, setTemplateId] = useState(appraisalData?.templateId || null);

    // Fetch form by DepartmentId
    const fetchform = async () => {
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
                // Set templateId if not already from appraisalData
                if (!templateId && res.data.data.templateId) {
                    setTemplateId(res.data.data.templateId);
                }
            } else setFormData([]);
        } catch (error) {
            console.error("Error fetching template:", error);
            setFormData([]);
        }
    };

    useEffect(() => { fetchform(); }, []);

    const [totalScore, setTotalScore] = useState(0);
    const [totalWeightage, setTotalWeightage] = useState(0);

    useEffect(() => { calculateTotalScore(); }, [formdata]);

    const calculateTotalScore = () => {
        const totalWeightedScore = formdata.reduce((sum, item) => sum + ((item.agileScore / 10) * item.kpiWeightage), 0);
        const totalWeight = formdata.reduce((sum, item) => sum + item.kpiWeightage, 0);
        setTotalWeightage(totalWeight);
        setTotalScore(totalWeightedScore);
    };

    const handleAgileScoreChange = (kpiId, score) => {
        const numericScore = parseFloat(score) || 0;
        if (numericScore >= 0 && numericScore <= 5) {
            setFormData(formdata.map(item => item.kpiId === kpiId ? { ...item, agileScore: numericScore } : item));
        }
    };

    const handleSupervisorScoreChange = (kpiId, score) => {
        const numericScore = parseFloat(score) || 0;
        if (numericScore >= 0 && numericScore <= 5) {
            setFormData(formdata.map(item => item.kpiId === kpiId ? { ...item, supervisorScore: numericScore } : item));
        }
    };

    const handleAssociateCommentChange = (kpiId, comment) => {
        setFormData(formdata.map(item => item.kpiId === kpiId ? { ...item, associateComment: comment } : item));
    };

    const handleSupervisorCommentChange = (kpiId, comment) => {
        setFormData(formdata.map(item => item.kpiId === kpiId ? { ...item, supervisorComment: comment } : item));
    };

    const getScorePercentage = () => totalWeightage > 0 ? ((totalScore / totalWeightage) * 100).toFixed(2) : 0;

    const getScoreGrade = (percentage) => {
        if (percentage >= 90) return { grade: "A+", color: "success" };
        if (percentage >= 80) return { grade: "A", color: "success" };
        if (percentage >= 70) return { grade: "B+", color: "warning" };
        if (percentage >= 60) return { grade: "B", color: "warning" };
        if (percentage >= 50) return { grade: "C", color: "info" };
        return { grade: "D", color: "danger" };
    };

    const handleSubmit = async (isFinal = false) => {
        try {
            const employeeId = appraisalData?.employeeId || parseInt(localStorage.getItem("employeeId"));
            const cycleId = appraisalData?.cycleId;
            if (!employeeId || !cycleId) {
                alert("Employee or cycle data is missing.");
                return;
            }

            const kpiResponses = formdata.map(item => ({
                kpiId: item.kpiId,
                selfScore: item.agileScore || 0,
                supervisorScore: item.supervisorScore || 0,
                associateComment: item.associateComment ?? "",
                supervisorComment: item.supervisorComment ?? ""
            }));

            const payload = {
                employeeId,
                cycleId,
                templateId: templateId,
                overallSelfScore: totalScore.toFixed(2),
                overallSupervisorScore: formdata.reduce((sum, i) => sum + (i.supervisorScore || 0), 0).toFixed(2),
                finalRating: "",
                status: "Submitted",
                createdBy: parseInt(localStorage.getItem("employeeId")),
                kpiResponses
            };

            const res = await axios.post(
                "https://localhost:7098/api/Appraisal/SubmitSelfAppraisal",
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

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
                                    <small className="text-muted">
                                        {appraisalData?.financialYear} - {appraisalData?.cycle}
                                    </small>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/self-appraisal-list")}>
                                        <i className="bi bi-arrow-left me-1"></i> Back to List
                                    </button>
                                    <button className="btn btn-success btn-sm" onClick={handleSubmit}>
                                        <i className="bi bi-check-circle me-1"></i> Submit Appraisal
                                    </button>
                                </div>
                            </div>
                        }
                    >
                        {/* Score Summary Card */}
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card border-primary">
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-primary">Overall Score</h5>
                                        <h2 className="mb-0">{totalScore.toFixed(2)}</h2>
                                        <small className="text-muted">Out of {totalWeightage}</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Proficiency Table */}
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
                                            <td className="text-center">
                                                <span className="badge bg-primary bg-opacity-10 text-primary">{item.kpiId}</span>
                                            </td>
                                            <td><span className="fw-medium">{item.kpiTitle}</span></td>
                                            <td><small className="text-muted">{item.kpiDescription}</small></td>
                                            <td className="text-center">
                                                <span className="badge bg-info bg-opacity-10 text-info">{item.kpiWeightage}%</span>
                                            </td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0"
                                                    max="5"
                                                    step="0.01"
                                                    value={item.agileScore}
                                                    onChange={(e) => handleAgileScoreChange(item.kpiId, e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0"
                                                    max="5"
                                                    step="0.01"
                                                    value={item.supervisorScore}
                                                    onChange={(e) => handleSupervisorScoreChange(item.kpiId, e.target.value)}
                                                    placeholder="0.00"
                                                    disabled={userRole !== "supervisor" && userRole !== "manager"}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    placeholder="Enter your comment..."
                                                    value={item.associateComment ?? ""}
                                                    onChange={(e) => handleAssociateCommentChange(item.kpiId, e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    placeholder="Supervisor comment..."
                                                    value={item.supervisorComment ?? ""}
                                                    onChange={(e) => handleSupervisorCommentChange(item.kpiId, e.target.value)}
                                                    disabled={userRole !== "supervisor" && userRole !== "manager"}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="table-secondary">
                                    <tr>
                                        <td className="text-center fw-bold"><i className="bi bi-calculator"></i></td>
                                        <td className="fw-bold">TOTALS</td>
                                        <td></td>
                                        <td className="text-center fw-bold">
                                            <span className="badge bg-secondary bg-opacity-10 text-secondary">{totalWeightage}%</span>
                                        </td>
                                        <td className="text-center fw-bold">
                                            <span className="badge bg-success bg-opacity-10 text-success">
                                                {formdata.reduce((sum, item) => sum + item.agileScore, 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="text-center fw-bold">
                                            <span className="badge bg-primary bg-opacity-10 text-primary">
                                                {formdata.reduce((sum, item) => sum + item.supervisorScore, 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Additional Comments Section */}
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0"><i className="bi bi-chat-square-text me-2"></i>Overall Associate Comments</h6>
                                    </div>
                                    <div className="card-body">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter your overall comments about your performance..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0"><i className="bi bi-person-check me-2"></i>Overall Supervisor Comments</h6>
                                    </div>
                                    <div className="card-body">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Supervisor overall comments..."
                                            disabled={userRole !== "supervisor" && userRole !== "manager"}
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
