import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardWrapper from "../../Component/CardWrapper";

const SelfAppraisalForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appraisalData = location.state?.appraisalData;
    const [userRole] = useState(localStorage.getItem("role") || "employee"); // Get user role from localStorage

    // Job Proficiency Data Array
    const [jobProficiencyData, setJobProficiencyData] = useState([
        {
            id: 1,
            proficiency: "Technical Skills and Knowledge",
            description: "Demonstrates proficiency in relevant technical skills, tools, and technologies. Shows ability to apply knowledge effectively in projects and problem-solving scenarios.",
            weightage: 25,
            agileScore: 0,
            supervisorScore: 0,
            associateComment: "",
            supervisorComment: ""
        },
        {
            id: 2,
            proficiency: "Communication and Collaboration",
            description: "Effectively communicates ideas, collaborates with team members, and maintains positive working relationships. Demonstrates clear written and verbal communication skills.",
            weightage: 20,
            agileScore: 0,
            supervisorScore: 0,
            associateComment: "",
            supervisorComment: ""
        },
        {
            id: 3,
            proficiency: "Problem Solving and Decision Making",
            description: "Analyzes problems systematically, identifies root causes, and develops effective solutions. Makes sound decisions based on available information and business context.",
            weightage: 20,
            agileScore: 0,
            supervisorScore: 0,
            associateComment: "",
            supervisorComment: ""
        },
        {
            id: 4,
            proficiency: "Project Management and Delivery",
            description: "Manages time effectively, meets deadlines, and delivers quality work. Demonstrates ability to plan, organize, and execute tasks within project constraints.",
            weightage: 15,
            agileScore: 0,
            supervisorScore: 0,
            associateComment: "",
            supervisorComment: ""
        },
        {
            id: 5,
            proficiency: "Learning and Development",
            description: "Shows commitment to continuous learning, adapts to new technologies and methodologies, and seeks opportunities for professional growth and skill enhancement.",
            weightage: 10,
            agileScore: 0,
            supervisorScore: 0,
            associateComment: "",
            supervisorComment: ""
        },
        {
            id: 6,
            proficiency: "Leadership and Team Building",
            description: "Demonstrates leadership qualities, mentors others, contributes to team success, and takes initiative in driving positive change within the organization.",
            weightage: 10,
            agileScore: 0,
            supervisorScore: 0,
            associateComment: "",
            supervisorComment: ""
        }
    ]);

    const [totalScore, setTotalScore] = useState(0);
    const [totalWeightage, setTotalWeightage] = useState(0);

    useEffect(() => {
        calculateTotalScore();
    }, [jobProficiencyData]);

    const calculateTotalScore = () => {
        const totalWeightedScore = jobProficiencyData.reduce((sum, item) => {
            return sum + (item.agileScore * item.weightage);
        }, 0);

        const totalWeight = jobProficiencyData.reduce((sum, item) => {
            return sum + item.weightage;
        }, 0);

        setTotalWeightage(totalWeight);
        setTotalScore(totalWeightedScore);
    };

    const handleAgileScoreChange = (id, score) => {
        const numericScore = parseFloat(score) || 0;
        if (numericScore >= 0 && numericScore <= 5) {
            const updatedData = jobProficiencyData.map(item =>
                item.id === id ? { ...item, agileScore: numericScore } : item
            );
            setJobProficiencyData(updatedData);
        }
    };

    const handleSupervisorScoreChange = (id, score) => {
        const numericScore = parseFloat(score) || 0;
        if (numericScore >= 0 && numericScore <= 5) {
            const updatedData = jobProficiencyData.map(item =>
                item.id === id ? { ...item, supervisorScore: numericScore } : item
            );
            setJobProficiencyData(updatedData);
        }
    };

    const handleAssociateCommentChange = (id, comment) => {
        const updatedData = jobProficiencyData.map(item =>
            item.id === id ? { ...item, associateComment: comment } : item
        );
        setJobProficiencyData(updatedData);
    };

    const handleSupervisorCommentChange = (id, comment) => {
        const updatedData = jobProficiencyData.map(item =>
            item.id === id ? { ...item, supervisorComment: comment } : item
        );
        setJobProficiencyData(updatedData);
    };

    const getScorePercentage = () => {
        return totalWeightage > 0 ? ((totalScore / totalWeightage) * 100).toFixed(2) : 0;
    };

    const getScoreGrade = (percentage) => {
        if (percentage >= 90) return { grade: "A+", color: "success" };
        if (percentage >= 80) return { grade: "A", color: "success" };
        if (percentage >= 70) return { grade: "B+", color: "warning" };
        if (percentage >= 60) return { grade: "B", color: "warning" };
        if (percentage >= 50) return { grade: "C", color: "info" };
        return { grade: "D", color: "danger" };
    };

    const handleSubmit = () => {
        // Here you would typically save the data to your backend
        console.log("Appraisal Data:", {
            appraisalInfo: appraisalData,
            jobProficiencyData,
            totalScore,
            totalWeightage,
            scorePercentage: getScorePercentage()
        });

        // Navigate back or show success message
        navigate("/self-appraisal-list");
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
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => navigate("/self-appraisal-list")}
                                    >
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Back to List
                                    </button>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={handleSubmit}
                                    >
                                        <i className="bi bi-check-circle me-1"></i>
                                        Submit Appraisal
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
                                        <th scope="col" className="fw-semibold" style={{ width: '5%' }}>
                                            <i className="bi bi-hash me-1"></i>
                                            #
                                        </th>
                                        <th scope="col" className="fw-semibold" style={{ width: '20%' }}>
                                            <i className="bi bi-list-ul me-1"></i>
                                            Job Proficiency
                                        </th>
                                        <th scope="col" className="fw-semibold" style={{ width: '25%' }}>
                                            <i className="bi bi-file-text me-1"></i>
                                            Description
                                        </th>
                                        <th scope="col" className="fw-semibold text-center" style={{ width: '8%' }}>
                                            <i className="bi bi-percent me-1"></i>
                                            Weightage
                                        </th>
                                        <th scope="col" className="fw-semibold text-center" style={{ width: '10%' }}>
                                            <i className="bi bi-star me-1"></i>
                                            Agile Score (0-5)
                                        </th>
                                        <th scope="col" className="fw-semibold text-center" style={{ width: '10%' }}>
                                            <i className="bi bi-person-check me-1"></i>
                                            Supervisor Score (0-5)
                                        </th>
                                        <th scope="col" className="fw-semibold" style={{ width: '11%' }}>
                                            <i className="bi bi-chat-left-text me-1"></i>
                                            Associate Comment
                                        </th>
                                        <th scope="col" className="fw-semibold" style={{ width: '11%' }}>
                                            <i className="bi bi-person-check me-1"></i>
                                            Supervisor Comment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobProficiencyData.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="text-center">
                                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                                    {item.id}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-medium">{item.proficiency}</span>
                                            </td>
                                            <td>
                                                <small className="text-muted">{item.description}</small>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-info bg-opacity-10 text-info">
                                                    {item.weightage}%
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0"
                                                    max="5"
                                                    step="0.01"
                                                    value={item.agileScore}
                                                    onChange={(e) => handleAgileScoreChange(item.id, e.target.value)}
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
                                                    onChange={(e) => handleSupervisorScoreChange(item.id, e.target.value)}
                                                    placeholder="0.00"
                                                    disabled={userRole !== "supervisor" && userRole !== "manager"}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    placeholder="Enter your comment..."
                                                    value={item.associateComment}
                                                    onChange={(e) => handleAssociateCommentChange(item.id, e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    placeholder="Supervisor comment..."
                                                    value={item.supervisorComment}
                                                    onChange={(e) => handleSupervisorCommentChange(item.id, e.target.value)}
                                                    disabled={userRole !== "supervisor" && userRole !== "manager"}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="table-secondary">
                                    <tr>
                                        <td className="text-center fw-bold">
                                            <i className="bi bi-calculator"></i>
                                        </td>
                                        <td className="fw-bold">
                                            <strong>TOTALS</strong>
                                        </td>
                                        <td></td>
                                        <td className="text-center fw-bold">
                                            <span className="badge bg-secondary bg-opacity-10 text-secondary">
                                                {totalWeightage}%
                                            </span>
                                        </td>
                                        <td className="text-center fw-bold">
                                            <span className="badge bg-success bg-opacity-10 text-success">
                                                {jobProficiencyData.reduce((sum, item) => sum + item.agileScore, 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="text-center fw-bold">
                                            <span className="badge bg-primary bg-opacity-10 text-primary">
                                                {jobProficiencyData.reduce((sum, item) => sum + item.supervisorScore, 0).toFixed(2)}
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
                                        <h6 className="mb-0">
                                            <i className="bi bi-chat-square-text me-2"></i>
                                            Overall Associate Comments
                                        </h6>
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
                                        <h6 className="mb-0">
                                            <i className="bi bi-person-check me-2"></i>
                                            Overall Supervisor Comments
                                        </h6>
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
