import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateLoginForm } from "./../utils/admin/loginValidation.js";
import { AdminContext } from "../context/AdminContext.jsx";

function Login() {
  const { handleLoginContext } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
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
            setPasswordMessage("");
            handleLoginContext(data.adminId);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            setMessage(data.message);
            setPasswordMessage("");
            setFormData({
              username: "",
              password: "",
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          setMessage("Something Went Wrong, Please try again later.", error);
          setPasswordMessage("");
          setLoading(false);
        });
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();

    if (forgotPasswordEmail) {
      setLoading(true);

      fetch(
        "http://localhost/react_php_local/backend/admin/forgot_password.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotPasswordEmail,
            username: formData.username,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPasswordMessage(
              `Password reset link successfully sent to ${forgotPasswordEmail}`
            );
          } else {
            setPasswordMessage(
              data.message || "Failed to send reset link, please try again."
            );
          }
          setLoading(false);
        })
        .catch((error) => {
          setPasswordMessage("An error occurred. Please try again later.");
          setLoading(false);
        });
    } else {
      setPasswordMessage("Please enter your email to reset your password.");
    }
  };


  const toggleForgotPassword = () => {
    setShowForgotPassword((prevState) => !prevState);
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
            {passwordMessage && (
              <div
                className={`alert ${
                  passwordMessage.toLowerCase().includes("success")
                    ? "alert-info"
                    : "alert-warning"
                }`}
              >
                {passwordMessage}
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

            {/* Show email field for forgot password */}
            {showForgotPassword && (
              <div className="mt-3">
                <div className="mb-3">
                  <label htmlFor="forgotPasswordEmail" className="form-label">
                    Enter Your Email:
                  </label>
                  <input
                    type="email"
                    id="forgotPasswordEmail"
                    name="forgotPasswordEmail"
                    value={forgotPasswordEmail}
                    onChange={handleForgotPasswordEmailChange}
                    className="form-control"
                    placeholder="Enter Your Email"
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    onClick={handleForgotPasswordSubmit}
                    className="btn btn-warning"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Email"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-3 text-center">
              <p>
                Not registered?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p>
                Forgot password?{" "}
                <span
                  className="text-decoration-none"
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={toggleForgotPassword}
                >
                  Click Here !
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
