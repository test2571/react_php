import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateLoginForm } from "./../utils/admin/loginValidation.js";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

    const loginValidationErrors = validateLoginForm(formData);
    setErrors(loginValidationErrors);

    if (Object.keys(loginValidationErrors).length === 0) {
      setLoading(true);

      fetch("http://localhost/react_php_local/backend/admin/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setMessage("Successfully logged in!");
            localStorage.setItem("adminId", data.adminId);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            setMessage(data.message);
            setFormData({
              username: "",
              password: "",
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          setMessage("Something Went Wrong, Please try again later.", error);
          setLoading(false);
        });
    }
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
                {errors.username && (
                  <small className="text-danger">{errors.username}</small>
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
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
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
