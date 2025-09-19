// src/pages/appraisal/AppraisalCyclePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Button, Card, Table, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cycleApiUrl = "https://localhost:7098/api/Cycle";
const financialApiUrl = "https://localhost:7098/api/Financial";

const AppraisalCyclePage = () => {
  const [cycles, setCycles] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cycles
  const fetchCycles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${cycleApiUrl}/GetAllCycles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCycles(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Error fetching cycles:", err);
      Swal.fire("Error", "Failed to fetch cycles", "error");
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch financial years
  const fetchFinancialYears = async () => {
    try {
      const res = await axios.get(`${financialApiUrl}/GetAllFinancialYears`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const years = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setFinancialYears(years);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0].financialYearId ?? years[0].financialyearid);
      }
    } catch (err) {
      console.error("Error fetching financial years:", err);
      Swal.fire("Error", "Failed to fetch financial years", "error");
      setFinancialYears([]);
    }
  };

  useEffect(() => {
    fetchCycles();
    fetchFinancialYears();
  }, []);

  // Filter cycles by selected financial year
  const filteredCycles = useMemo(() => {
    if (!selectedYear) return cycles;
    return cycles.filter(
      (c) => (c.financialYearId ?? c.financialyearid) === parseInt(selectedYear)
    );
  }, [cycles, selectedYear]);

  // Delete cycle
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${cycleApiUrl}/DeleteCycle?CycleId=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("Deleted", "Cycle deleted successfully", "success");
        fetchCycles();
      } catch (err) {
        console.error("Error deleting cycle:", err);
        Swal.fire("Error", "Failed to delete cycle", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center bg-secondary text-white">
          <h4 className="mb-0">Appraisal Cycles</h4>
          <Button variant="success" onClick={() => navigate("/add-cycle")}>
            <FaPlus /> Add Cycle
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Financial Year Dropdown */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label className="me-2 fw-bold">Financial Year:</Form.Label>
            <Form.Select
              style={{ width: "250px" }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">-- Select Year --</option>
              {financialYears.map((fy) => (
                <option
                  key={fy.financialYearId ?? fy.financialyearid}
                  value={fy.financialYearId ?? fy.financialyearid}
                >
                  {fy.yearName ?? fy.yearname}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Cycles Table */}
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cycle Name</th>
                  <th>Financial Year</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCycles.length > 0 ? (
                  filteredCycles.map((c) => {
                    const year = financialYears.find(
                      (fy) =>
                        (fy.financialYearId ?? fy.financialyearid) ===
                        (c.financialYearId ?? c.financialyearid)
                    );
                    return (
                      <tr key={c.cycleId}>
                        <td>{c.cycleId}</td>
                        <td>{c.cycleName}</td>
                        <td>{year ? year.yearName ?? year.yearname : "-"}</td>
                        <td>{new Date(c.startDate).toLocaleDateString()}</td>
                        <td>{new Date(c.endDate).toLocaleDateString()}</td>
                        <td>{c.statusId === 1 ? "Active" : "Inactive"}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() =>
                              navigate("/add-cycle", { state: { cycle: c } })
                            }
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(c.cycleId)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No cycles found for this financial year
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AppraisalCyclePage;
