import React from "react";
import { Card } from "react-bootstrap";

function DashboardCard({ title, value, icon, color }) {
  return (
    <Card className={`text-white mb-4 shadow-sm`} style={{ backgroundColor: color }}>
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <Card.Title>{title}</Card.Title>
          <h3>{value}</h3>
        </div>
        <div style={{ fontSize: "2rem", opacity: 0.7 }}>{icon}</div>
      </Card.Body>
    </Card>
  );
}

export default DashboardCard;
