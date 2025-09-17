import React from "react";
import "./about.css";


function About() {
  const toggleSidebar = () => {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("sidebarOverlay").classList.toggle("active");
  };

  return (
    <div>
    
      <div className="d-flex flex-column flex-lg-row">
    
        <nav className="sidebar border-end" id="sidebar">
          <h5 className="fw-bold">🎬 Ticket New</h5>
          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-chart-line me-2"></i> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-th-large me-2"></i> Layouts
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-inbox me-2"></i> Mailbox
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-cubes me-2"></i> UI Elements
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-pen-square me-2"></i> Forms
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-table me-2"></i> Tables
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-chart-pie me-2"></i> Charts
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-map-marked-alt me-2"></i> Maps
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-user-circle me-2"></i> Profile
              </a>
            </li>
          </ul>
        </nav>

       
        <div className="flex-grow-1 col-12 col-md-12 col-lg-3 p-4">
          {/* Topbar */}
          <div className="d-flex align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <button
                className="mobile-nav-toggle expand-lg text-white"
                onClick={toggleSidebar}
              >
                ☰
              </button>
              <h4 className="mt-1 fw-bold">Dashboard</h4>
            </div>

            <div
              id="sidebarOverlay"
              className="overlay"
              onClick={toggleSidebar}
            ></div>

            <div className="d-flex align-items-center w-100 w-md-auto p-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search here..."
              />
              <a href="#">
                <img
                  src="./assets/image/user.png"
                  height="50"
                  width="50"
                  alt="user"
                  className="p-2"
                />
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4 p-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card text-center p-4">
                <h6 className="fw-bold">🎫 Total Ticket</h6>
                <h5>
                  105 <span className="text-success">+4.5%</span>
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card text-center p-4">
                <h6 className="fw-bold">📈 Assign Ticket</h6>
                <h5>
                  50 <span className="text-danger">-4.5%</span>
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card text-center p-4">
                <h6 className="fw-bold">🎟️ Today Ticket</h6>
                <h5>
                  20 <span className="text-success">+5.5%</span>
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card text-center p-4">
                <h6 className="fw-bold">👤 Customer Online</h6>
                <h5>
                  8 <span className="text-success">+2.5%</span>
                </h5>
              </div>
            </div>
          </div>

         
          <div className="card p-4 mt-4">
            <h5 className="mb-3">🎟️ Booking Details</h5>
            <div className="list-group">
            
              <div className="list-group-item bg-dark text-light d-none d-md-flex fw-bold">
                <div className="col-md-1">#</div>
                <div className="col-md-2">Name</div>
                <div className="col-md-2">Movie</div>
                <div className="col-md-2">Status</div>
                <div className="col-md-2">Booking Date</div>
                <div className="col-md-1">Seat No</div>
                <div className="col-md-1">Change</div>
                <div className="col-md-1">Delete</div>
              </div>

              <div className="list-group-item bg-transparent text-light d-md-flex">
                <div className="col-md-1">1</div>
                <div className="col-md-2">John Doe</div>
                <div className="col-md-2">Avengers</div>
                <div className="col-md-2 text-success">Confirmed</div>
                <div className="col-md-2">2025-07-13</div>
                <div className="col-md-1">A10, A11</div>
                <div className="col-md-1">
                  <button className="btn btn-outline-info btn-sm">
                    <i className="fas fa-pen me-1"></i> Edit
                  </button>
                </div>
                <div className="col-md-1">
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="fas fa-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

 
      <footer>
        <div className="social-media mt-5 p-1">
          <a href="#">
            <i className="fa-brands fa-facebook fa-2xl" style={{ color: "#ebebeb" }}></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-x-twitter fa-2xl" style={{ color: "#ebebeb" }}></i>
          </a>
          <a href="#">
            <i className="fa-regular fa-envelope fa-2xl" style={{ color: "#ebebeb" }}></i>
          </a>
        </div>
        <div className="text-center mt-4 fw-bold">
          © 2025 All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default About;
