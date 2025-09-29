import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Badge,
  Accordion,
  Fade,
} from "react-bootstrap";
import CardWrapper from "../../Component/CardWrapper";

const ViewAppraisal = () => {
  const [appraisal, setAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const query = new URLSearchParams(location.search);
  const appraisalId = query.get("appraisalId") || location.state?.appraisalId;

  useEffect(() => {
    if (!appraisalId) return;

    axios
      .get("https://localhost:7098/api/SelfAppraisal/GetAppraisalById", {
        params: { appraisalId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppraisal(res.data.data?.[0] || null);
        setLoading(false);
        setShow(true);
      })
      .catch((err) => {
        console.error("Error fetching appraisal:", err);
        setLoading(false);
      });
  }, [appraisalId, token]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!appraisal)
    return (
      <Container className="mt-5">
        <p className="text-center text-muted">No appraisal found.</p>
        <div className="text-center">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Container>
    );

  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid className="mt-5">
      <Fade in={show} appear>
        <div>
          <Row className="mb-4 g-4">
            {/* Employee Details */}
            <Col md={6}>
              <CardWrapper
                variant="default"
                hover={true}
                header={
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-badge me-2"></i>
                    <h5 className="mb-0">Employee Details</h5>
                  </div>
                }
              >
                <p>
                  <strong>Name:</strong> {appraisal.employeeName || "-"}
                </p>
                <p>
                  <strong>Unit:</strong> {appraisal.unitName || "-"}
                </p>
                <p>
                  <strong>Cycle:</strong> {appraisal.cycleName || "-"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg={getBadgeVariant(appraisal.status)}>
                    {appraisal.status || "-"}
                  </Badge>
                </p>
                <p>
                  <strong>Final Rating:</strong>{" "}
                  <Badge bg="info">{appraisal.finalRating || "-"}</Badge>
                </p>
              </CardWrapper>
            </Col>

            {/* Overall Scores */}
            <Col md={6}>
              <CardWrapper
                variant="default"
                hover={true}
                header={
                  <div className="d-flex align-items-center">
                    <i className="bi bi-bar-chart-line-fill me-2"></i>
                    <h5 className="mb-0">Overall Scores & Comments</h5>
                  </div>
                }
              >
                <p>
                  <strong>Self Score:</strong>{" "}
                  <Badge bg="secondary">{appraisal.overallSelfScore ?? "-"}</Badge>
                </p>
                <p>
                  <strong>Manager Score:</strong>{" "}
                  <Badge bg="secondary">{appraisal.overallSupervisorScore ?? "-"}</Badge>
                </p>
                <p>
                  <strong>Associate Comment:</strong>{" "}
                  {appraisal.overallAssociateComment || "-"}
                </p>
                <p>
                  <strong>Supervisor Comment:</strong>{" "}
                  {appraisal.overallSupervisorComment || "-"}
                </p>
              </CardWrapper>
            </Col>
          </Row>

          {/* KPI Responses */}
          <Row>
            <Col>
              <CardWrapper
                variant="default"
                hover={true}
                header={
                  <div className="d-flex align-items-center">
                    <i className="bi bi-clipboard-check-fill me-2"></i>
                    <h5 className="mb-0">KPI Responses</h5>
                  </div>
                }
              >
                <Accordion defaultActiveKey="0" className="shadow-sm">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>KPI Details</Accordion.Header>
                    <Accordion.Body className="p-0">
                      <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="mb-0 text-center align-middle"
                      >
                        <thead className="table-primary">
                          <tr>
                            <th>KPI</th>
                            <th>Self Score</th>
                            <th>Manager Score</th>
                            <th>Associate Comment</th>
                            <th>Supervisor Comment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appraisal.kpiResponses?.length > 0 ? (
                            appraisal.kpiResponses.map((kpi, idx) => (
                              <tr key={idx}>
                                <td className="text-start">{kpi.kpiName || "-"}</td>
                                <td>{kpi.selfScore ?? "-"}</td>
                                <td>{kpi.supervisorScore ?? "-"}</td>
                                <td>{kpi.associateComment || "-"}</td>
                                <td>{kpi.supervisorComment || "-"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">
                                No KPI responses found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </CardWrapper>
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left-circle me-2"></i>
              Back
            </Button>
          </div>
        </div>
      </Fade>
    </Container>
  );
};

export default ViewAppraisal;
