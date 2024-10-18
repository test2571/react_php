import React, { useContext } from "react";
import { FaUserEdit, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdMarkEmailUnread, MdDriveFileRenameOutline } from "react-icons/md";
import { AdminContext } from "../context/AdminContext.jsx";
import { Link } from "react-router-dom";

function Profile() {
  const { adminDetails } = useContext(AdminContext);

  const renderStatusIcon = (status) => {
    if (status === "Active") {
      return <FaCheckCircle size={30} className="text-success me-2" />;
    } else {
      return <FaTimesCircle size={30} className="text-danger me-2" />;
    }
  };
  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div
          className="card-header text-center"
          style={{ backgroundColor: "#016A70" }}
        >
          <h2 className="text-white">Admin Profile</h2>
        </div>
        <div className="card-body bg-light p-5">
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <FaUserEdit size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Username : </h5>
                  <h6 className="text-dark mb-2">{adminDetails.username}</h6>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <MdMarkEmailUnread size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Email : </h5>
                  <h6 className="text-dark mb-2">{adminDetails.email}</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <MdDriveFileRenameOutline size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">
                    Full Name :{" "}
                  </h5>
                  <h6 className="text-dark mb-2">{adminDetails.full_name}</h6>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <FaPhone size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Phone No : </h5>
                  <h6 className="text-dark mb-2">{adminDetails.phone_no}</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <h5 className="text-dark text-uppercase">Status:</h5>
              {renderStatusIcon(adminDetails.status)}
              <span
                className={`badge ${
                  adminDetails.status === "Active" ? "bg-success" : "bg-danger"
                }`}
              >
                {adminDetails.status}
              </span>
            </div>
          </div>
        </div>
        <div
          className="card-footer text-center"
          style={{ backgroundColor: "#538392" }}
        >
          <Link to="/dashboard">
            <button className="btn btn-light me-2">Back to Dashboard</button>
          </Link>
          <button className="btn btn-dark me-2">Update Password</button>
          <button className="btn btn-light me-2">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
