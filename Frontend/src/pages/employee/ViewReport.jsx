// src/pages/reports/ViewReport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner } from "react-bootstrap";
import CardWrapper from "../../Component/CardWrapper";
import Swal from "sweetalert2";

const ViewReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7098/api/Reports/GetReports", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(response.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      Swal.fire("Error", "Failed to fetch reports.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container-fluid mt-5">
      <CardWrapper
        variant="default"
        hover={true}
        header={<h4 className="mb-0 text-dark">Reports</h4>}
      >
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-5">No reports available.</div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Report Name</th>
                <th>Created By</th>
                <th>Created On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.reportId || index}>
                  <td>{index + 1}</td>
                  <td>{report.reportName}</td>
                  <td>{report.createdBy}</td>
                  <td>{report.createdOn ? new Date(report.createdOn).toLocaleDateString() : "-"}</td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardWrapper>
    </div>
  );
};

export default ViewReport;
