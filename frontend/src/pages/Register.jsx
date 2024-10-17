import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateRegisterForm } from "./../utils/admin/registerValidation.js";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    phoneno: "",
    status: "Active",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const registerValidationErrors = validateRegisterForm(formData);
    setErrors(registerValidationErrors);

    if (Object.keys(registerValidationErrors).length === 0) {
      setLoading(true);

      fetch("http://localhost/react_php_local/backend/admin/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setMessage("Successfully Registered! Please Login!");
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            setMessage(data.message);
            setFormData({
              username: "",
              email: "",
              password: "",
              fullname: "",
              phoneno: "",
              status: "Active",
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          setMessage(
            "This username already exists. try something else.",
            error
          );
          setLoading(false);
        });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h1 className="text-center mb-4">Register Form</h1>

            {message && (
              <div
                className={`alert ${
                  message === "Successfully Registered! Please Login!"
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Your Username"
                />
                {errors.username && (
                  <small className="text-danger">{errors.username}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Your Email"
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Your Password"
                />
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="fullname" className="form-label">
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Your Full Name"
                />
                {errors.fullname && (
                  <small className="text-danger">{errors.fullname}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="phoneno" className="form-label">
                  Phone No:
                </label>
                <input
                  type="text"
                  id="phoneno"
                  name="phoneno"
                  value={formData.phoneno}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Your Phone No"
                />
                {errors.phoneno && (
                  <small className="text-danger">{errors.phoneno}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Register"}
                </button>
              </div>
            </form>

            <div className="mt-3 text-center">
              <p>
                already registered?{" "}
                <Link to="/" className="text-decoration-none">
                  login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
