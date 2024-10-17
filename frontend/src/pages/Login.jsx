import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    fetch("http://localhost/react_php/backend/admin/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("success : ", data);
        if (data.status === "success") {
          setMessage("Successfully logged in!");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          console.error("Login failed:", data.message);
          setMessage("Invalid Credentials, Please try again.");
          setFormData({
            username: "",
            password: "",
          });
        }
      })
      .catch((error) => {
        console.error("error : ", error);
        setMessage("Something Went Wrong, Please try again later.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h1 className="text-center mb-4">Login Form</h1>

            {message && (
              <div
                className={`alert ${
                  message === "Successfully logged in!"
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
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>

            <div className="mt-3 text-center">
              <p>
                Not registered?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
