import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParam] = useSearchParams();
  const userId = searchParam.get("userid");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const validatePasswords = () => {
    let formErrors = {};
    if (!newPassword) formErrors.newPassword = "New password is required.";
    if (newPassword.length < 6) {
      formErrors.newPassword = "Password should contain atleast 6 charactes";
    }
    if (confirmPassword.length < 6) {
      formErrors.newPassword = "Password should contain atleast 6 charactes";
    }
    if (newPassword !== confirmPassword)
      formErrors.confirmPassword = "Passwords do not match.";
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validatePasswords();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      fetch(
        "http://localhost/react_php_local/backend/admin/reset_password.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newPassword,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMessage("Password successfully reset! Redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
          } else {
            setMessage(data.message);
          }
        })
        .catch(() =>
          setMessage("Something went wrong, please try again later.")
        );
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Reset Password</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter new password"
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
            value={confirmPassword}
            onChange={handleChange}
            className="form-control"
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <small className="text-danger">{errors.confirmPassword}</small>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
