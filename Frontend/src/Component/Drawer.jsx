import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Drawer = () => {
  return (
    <>
      {/* Button to open drawer */}
      <button
        className="btn btn-primary m-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#drawer"
        aria-controls="drawer"
      >
        Open Drawer
      </button>

      {/* Drawer / Offcanvas */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="drawer"
        aria-labelledby="drawerLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="drawerLabel">
            Drawer Menu
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
            <li className="list-group-item">Home</li>
            <li className="list-group-item">Profile</li>
            <li className="list-group-item">Appraisal Cycle</li>
            <li className="list-group-item">Reports</li>
            <li className="list-group-item">Logout</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Drawer;
