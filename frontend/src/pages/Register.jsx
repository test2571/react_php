import React, { useState } from "react";
import { Link } from "react-router-dom";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    fetch("http://localhost/react_php/backend/admin/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success: ", data);
        if (data.status === "success") {
          setMessage("Successfully Registered! Please Login!");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          console.error("Register failed:", data.message);
          setMessage("Coundn't Register, Please try again.");
          setFormData({
            username: "",
            email: "",
            password: "",
            fullname: "",
            phoneno: "",
            status: "Active",
          });
        }
      })
      .catch((error) => {
        console.error("error : ", error);
        setMessage("Something Went Wrong, Please try again later.");
      });
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
                <button type="submit" className="btn btn-primary">
                  Register
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
