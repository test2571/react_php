import React, { useContext } from "react";
import { FaEye, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { BiSolidBinoculars } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import "./../../public/css/dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext.jsx";

function Dashboard() {
  const { adminDetails, handleLogoutContext } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirm = confirm("Do you really want to logout? ");

    if (isConfirm) {
      handleLogoutContext();
      navigate("/");
    }
  };

  return (
    <div className="container mt-5">
      {/* Welcome Message */}
      <div className="dashboard-header text-center p-4 mb-5">
        <h1 className="display-4">Welcome, @{adminDetails.username}</h1>
        <p>Your Dashboard - Manage categories, products, and your profile.</p>
      </div>

      <div className="row">
        {/* Add Category Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card text-center shadow border-0"
            style={{ backgroundColor: "#EAF6FF" }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center py-5">
              <MdCategory size={60} className="mb-3 text-primary" />
              <h5 className="card-title">Add Category</h5>
              <Link to="/addCategory">
                <button className="btn btn-primary btn-lg mt-3 px-4">
                  Go to Add Category
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Add Product Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card text-center shadow border-0"
            style={{ backgroundColor: "#FFF8E0" }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center py-5">
              <AiFillProduct size={60} className="mb-3 text-warning" />
              <h5 className="card-title">Add Product</h5>
              <button className="btn btn-warning btn-lg mt-3 px-4">
                Go to Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Admin Profile Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card text-center shadow border-0"
            style={{ backgroundColor: "#FFE7E7" }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center py-5">
              <FaUser size={60} className="mb-3 text-danger" />
              <h5 className="card-title">Admin Profile</h5>
              <Link to="/profile">
                <button className="btn btn-danger btn-lg mt-3 px-4">
                  Go to Admin Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* View Category Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card text-center shadow border-0"
            style={{ backgroundColor: "#ECFFED" }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center py-5">
              <FaEye size={60} className="mb-3 text-success" />
              <h5 className="card-title">View Category</h5>
              <Link to="/viewCategory">
                <button className="btn btn-success btn-lg mt-3 px-4">
                  Go to View Category
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* View Product Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card text-center shadow border-0"
            style={{ backgroundColor: "#E3F8FF" }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center py-5">
              <BiSolidBinoculars size={60} className="mb-3 text-info" />
              <h5 className="card-title">View Product</h5>
              <button className="btn btn-info btn-lg mt-3 px-4">
                Go to View Product
              </button>
            </div>
          </div>
        </div>

        {/* Log out Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card text-center shadow border-0"
            style={{ backgroundColor: "#FFEBE5" }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center py-5">
              <FaSignOutAlt size={60} className="mb-3 text-dark" />
              <h5 className="card-title">Logout</h5>
              <button
                onClick={handleLogout}
                className="btn btn-dark btn-lg mt-3 px-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
