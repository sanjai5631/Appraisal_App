import React, { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import FinancialYearForm from "./FinancialYearForm";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons CSS is imported

const FinancialYearDashboard = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editYear, setEditYear] = useState(null);

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7098/api/Financial/GetAllFinancialYears"
      );
      console.log("API response:", response.data);

      if (Array.isArray(response.data)) {
        setFinancialYears(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setFinancialYears(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setFinancialYears([]);
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
      Swal.fire("Error", "Failed to fetch financial years", "error");
      setFinancialYears([]);
    }
    setLoading(false);
  };

  const handleEdit = (year) => {
    setEditYear(year);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(
      `https://localhost:7098/api/Financial/DeleteFinancialYear?financialYearId=${id}`
    );
    Swal.fire("Deleted!", "Financial year deleted successfully", "success");
    fetchFinancialYears();
  } catch (error) {
    console.error("Delete error:", error);
    Swal.fire("Error", "Failed to delete financial year", "error");
  }
};


  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Financial Years</h4>
        <Button
          variant="success"
          onClick={() => {
            setEditYear(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i> Create
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Year Name</th>
              <th>Start Year</th>
              <th>End Year</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {financialYears.length ? (
              financialYears.map((year) => (
                <tr key={year.financialYearId}>
                  <td>{year.yearName}</td>
                  <td>{year.startYear}</td>
                  <td>{year.endYear}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(year)}
                    >
                      <i className="bi bi-pencil-square"></i> {/* Edit icon */}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(year.financialYearId)}
                    >
                      <i className="bi bi-trash"></i> {/* Delete icon */}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No financial years found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {showModal && (
        <FinancialYearForm
          show={showModal}
          onHide={() => setShowModal(false)}
          onSuccess={fetchFinancialYears}
          editData={editYear}
        />
      )}
    </Card>
  );
};

export default FinancialYearDashboard;
