import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryValidation } from "./../utils/category/categoryValidation.js";

function CategoryForm() {
  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategory: "",
    status: "Active",
  });
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/react_php_local/backend/category/categories.php")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setMessage("");

    const categoryValidationErrors = categoryValidation(formData);
    setErrors(categoryValidationErrors);

    const adminId = localStorage.getItem("adminId");

    const formDataWithId = {
      ...formData,
      adminId: adminId,
    };

    if (Object.keys(categoryValidationErrors).length === 0) {
      setLoading(true);

      fetch(
        "http://localhost/react_php_local/backend/category/addCategory.php",
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
            setMessage("Category added successfully!");
            setTimeout(() => {
              navigate("/viewCategory");
            }, 2000);
          } else {
            setMessage(data.message);
            setFormData({
              categoryName: "",
              parentCategory: "",
              status: "Active",
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          setMessage("Something went wrong. Please try again later.", error);
          setFormData({
            categoryName: "",
            parentCategory: "",
            status: "Active",
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
            <h1 className="text-center mb-4">Category Form</h1>

            {message && (
              <div
                className={`alert ${
                  message === "Category added successfully!"
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name:
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  required
                  name="categoryName"
                  className="form-control"
                  placeholder="Enter Category Name"
                />{" "}
                {errors.categoryName && (
                  <small className="text-danger">{errors.categoryName}</small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="parentCategory" className="form-label">
                  Parent Category:
                </label>
                <select
                  id="parentCategory"
                  name="parentCategory"
                  className="form-select"
                  value={formData.parentCategory}
                  onChange={handleChange}
                >
                  <option value="">Select Parent Category</option>
                  <option value="0">No Parent (Top Level)</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {"--".repeat(category.level)} {category.category_name}
                    </option>
                  ))}
                </select>
                {errors.parentCategory && (
                  <small className="text-danger">{errors.parentCategory}</small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
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
                  {loading ? "Loading..." : "Add Category"}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/dashboard"
                className="text-decoration-none text-white bg-dark p-2 rounded"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryForm;
