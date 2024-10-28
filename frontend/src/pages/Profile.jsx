import React, { useContext, useEffect, useState } from "react";
import { FaUserEdit, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdMarkEmailUnread, MdDriveFileRenameOutline } from "react-icons/md";
import { AdminContext } from "../context/AdminContext.jsx";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const { adminDetails, handleLogoutContext, updateAdminDetails } =
    useContext(AdminContext);
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    full_name: false,
    phone_no: false,
  });
  const [formValues, setFormValues] = useState({
    username: adminDetails.username,
    email: adminDetails.email,
    full_name: adminDetails.full_name,
    phone_no: adminDetails.phone_no,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirm = confirm("Do you really want to logout?");
    if (isConfirm) {
      handleLogoutContext();
      navigate("/");
    }
  };

  const toggleEditing = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Validation Function
  const validateFields = (field) => {
    switch (field) {
      case "username":
        if (formValues.username.length < 5)
          return "Username must be at least 5 characters.";
        if (!/^[a-zA-Z0-9]+$/.test(formValues.username))
          return "Username can only contain letters and numbers.";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(formValues.email))
          return "Please enter a valid email address.";
        break;
      case "full_name":
        if (formValues.full_name.length < 3)
          return "Full Name must be at least 3 characters long.";
        break;
      case "phone_no":
        if (
          formValues.phone_no.length !== 10 ||
          !/^\d{10}$/.test(formValues.phone_no)
        )
          return "Phone No must be exactly 10 digits long.";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleSave = async (field) => {
    const validationError = validateFields(field);
    if (validationError) {
      setError(validationError);
      return;
    }

    const confirmSave = confirm(
      `Are you sure you want to save the changes to ${field}?`
    );
    if (!confirmSave) return;

    try {
      const response = await fetch(
        "http://localhost/react_php_local/backend/admin/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field,
            value: formValues[field],
            admin_id: adminDetails.admin_id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toggleEditing(field);
        setSuccessMessage(
          `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } changed successfully.`
        );

        updateAdminDetails({ ...adminDetails, [field]: formValues[field] });

        setTimeout(() => setSuccessMessage(""), 3000);
      } else if (data.error === "username_taken") {
        setError("Username is already taken. Please choose another one.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  const toggleStatus = async () => {
    const newStatus = adminDetails.status === "Active" ? "InActive" : "Active";
    const confirmChange = confirm(
      `Are you sure you want to ${newStatus} the account?`
    );
    if (!confirmChange) return;

    try {
      const response = await fetch(
        "http://localhost/react_php_local/backend/admin/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field: "status",
            value: newStatus,
            admin_id: adminDetails.admin_id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        updateAdminDetails({ ...adminDetails, status: newStatus });
        setSuccessMessage(`Status changed to ${newStatus}.`);
      } else {
        setError("Failed to change status. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const renderStatusIcon = (status) => {
    return status === "Active" ? (
      <FaCheckCircle size={30} className="text-success me-2" />
    ) : (
      <FaTimesCircle size={30} className="text-danger me-2" />
    );
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account !"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          "http://localhost/react_php_local/backend/admin/delete.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              admin_id: adminDetails.admin_id,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccessMessage("Account deleted successfully. Please wait while we redirect you...");
          setTimeout(() => {
            handleLogoutContext();
            navigate("/");
          },4000);
        } else {
          setError("Failed to delete account. Please try again.");
        }
      } catch (error) {
        setError("Server error. Please try again later.");
      }
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
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          <div className="row">
            {/* Username Field */}
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <FaUserEdit size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Username:</h5>
                  <h6
                    className="text-dark mb-2"
                    onClick={() => toggleEditing("username")}
                    style={{ cursor: "pointer" }}
                  >
                    {adminDetails.username}
                  </h6>
                  {isEditing.username && (
                    <div id="usernameEdit">
                      <input
                        type="text"
                        placeholder="Enter new username"
                        className="me-2"
                        value={formValues.username}
                        onChange={(e) =>
                          handleChange("username", e.target.value)
                        }
                      />
                      <button
                        className="btn btn-primary p-1 me-2"
                        onClick={() => handleSave("username")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger p-1"
                        onClick={() => toggleEditing("username")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <MdMarkEmailUnread size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Email:</h5>
                  <h6
                    className="text-dark mb-2"
                    onClick={() => toggleEditing("email")}
                    style={{ cursor: "pointer" }}
                  >
                    {adminDetails.email}
                  </h6>
                  {isEditing.email && (
                    <div id="emailEdit">
                      <input
                        type="text"
                        placeholder="Enter new email"
                        className="me-2"
                        value={formValues.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                      <button
                        className="btn btn-primary p-1 me-2"
                        onClick={() => handleSave("email")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger p-1"
                        onClick={() => toggleEditing("email")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Name Field */}
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <MdDriveFileRenameOutline size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Full Name:</h5>
                  <h6
                    className="text-dark mb-2"
                    onClick={() => toggleEditing("full_name")}
                    style={{ cursor: "pointer" }}
                  >
                    {adminDetails.full_name}
                  </h6>
                  {isEditing.full_name && (
                    <div id="fullNameEdit">
                      <input
                        type="text"
                        placeholder="Enter new full name"
                        className="me-2"
                        value={formValues.full_name}
                        onChange={(e) =>
                          handleChange("full_name", e.target.value)
                        }
                      />
                      <button
                        className="btn btn-primary p-1 me-2"
                        onClick={() => handleSave("full_name")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger p-1"
                        onClick={() => toggleEditing("full_name")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-start">
                <FaPhone size={50} className="me-2" />
                <div>
                  <h5 className="text-dark mb-2 text-uppercase">Phone No:</h5>
                  <h6
                    className="text-dark mb-2"
                    onClick={() => toggleEditing("phone_no")}
                    style={{ cursor: "pointer" }}
                  >
                    {adminDetails.phone_no}
                  </h6>
                  {isEditing.phone_no && (
                    <div id="phoneEdit">
                      <input
                        type="text"
                        placeholder="Enter new phone number"
                        className="me-2"
                        value={formValues.phone_no}
                        onChange={(e) =>
                          handleChange("phone_no", e.target.value)
                        }
                      />
                      <button
                        className="btn btn-primary p-1 me-2"
                        onClick={() => handleSave("phone_no")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger p-1"
                        onClick={() => toggleEditing("phone_no")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
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
              <button
                className={`btn ms-3 ${
                  adminDetails.status === "Active"
                    ? "btn-danger"
                    : "btn-success"
                }`}
                onClick={toggleStatus}
              >
                {adminDetails.status === "Active" ? "InActive" : "Activate"}
              </button>
            </div>
          </div>
          <h5 className="text-content text-center text-primary">
            Click on any field to update your details.
          </h5>
        </div>

        <div
          className="card-footer text-center"
          style={{ backgroundColor: "#538392" }}
        >
          <Link to="/dashboard">
            <button className="btn btn-light me-2">Back to Dashboard</button>
          </Link>
          <Link to="/updatePassword">
            <button className="btn btn-dark me-2">Update Password</button>
          </Link>
          <button onClick={handleLogout} className="btn btn-light me-2">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="btn btn-dark me-2">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
