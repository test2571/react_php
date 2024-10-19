import React, { useState } from "react";
import { updatePassword } from "./../utils/admin/updatePassword.js";
import { Link } from "react-router-dom";

function UpdatePassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const updatePasswordErrors = updatePassword(formData);
    setErrors(updatePasswordErrors);

    if (Object.keys(updatePasswordErrors).length === 0) {
      setLoading(true);

      const adminId = localStorage.getItem("adminId");

      const formDataWithId = {
        ...formData,
        adminId: adminId,
      };

      fetch(
        "http://localhost/react_php_local/backend/admin/updatePassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataWithId),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setMessage("Password updated successfully!");
            setFormData({
              newPassword: "",
              confirmPassword: "",
            });
            setLoading(false);
          } else {
            setMessage(data.message);
            setFormData({
              newPassword: "",
              confirmPassword: "",
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          setMessage("Something Went Wrong, Please try again later.", error);
          setFormData({
            newPassword: "",
            confirmPassword: "",
          });
          setLoading(false);
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h1 className="text-center mb-4">Update Password</h1>

            {message && (
              <div
                className={`alert ${
                  message === "Password updated successfully!"
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter New Password"
                />
                {errors.newPassword && (
                  <small className="text-danger">{errors.newPassword}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Confirm Password"
                />
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Update Password"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p>
                <Link to="/profile" className="text-decoration-none text-white bg-dark p-2 rounded">
                  Back To Profile
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
