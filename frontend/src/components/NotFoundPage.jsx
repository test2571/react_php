import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 bg-white rounded shadow-lg">
        <img
          src="./../../public/media/404.webp"
          alt="404 - Page Not Found"
          className="img-fluid mb-4"
          style={{ maxWidth: "500px" }}
        />
        <h1 className="display-4 text-dark">Page Not Found</h1>
        <p className="lead text-muted">
          We’re sorry, but the page you’re looking for doesn’t exist.
        </p>

        <Link to="/" className="btn btn-primary mt-3">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
