import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CategoryList() {
  const recordsPerPage = 5;
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [searchQuery, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost/react_php_local/backend/category/categoryList.php?page=${currentPage}&searchQuery=${searchQuery}`
      );
      const data = await response.json();
      setCategories(data.categories);
      setTotalPages(Math.ceil(data.totalCategories / recordsPerPage));
    } catch (error) {
      setErrorMessage("An error occurred while fetching categories.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (categoryId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmation) {
      try {
        const response = await fetch(
          `http://localhost/react_php_local/backend/category/categoryDelete.php?cid=${categoryId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (result.success) {
          setErrorMessage("");
          setSuccessMessage(result.message);
        } else {
          setSuccessMessage("");
          setErrorMessage(
            result.message || "An error occurred during deletion!"
          );
        }

        fetchCategories();
      } catch (error) {
        setSuccessMessage("");
        setErrorMessage("An error occurred while deleting the category!");
      }
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/addCategory?cid=${categoryId}`);
  };

  const handleCheckboxChange = (catgegoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(catgegoryId)
        ? prevSelected.filter((id) => id !== catgegoryId)
        : [...prevSelected, catgegoryId]
    );
  };

  const handleBulkDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete the selected categories?"
    );
    if (confirmation) {
      try {
        const response = await fetch(
          `http://localhost/react_php_local/backend/category/categoryBulkDelete.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryIds: selectedCategories }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setErrorMessage("");
          setSuccessMessage(result.message);
          setSelectedCategories([]);
        } else {
          setSuccessMessage("");
          setErrorMessage(
            result.message || "An error occurred during deletion!"
          );
        }

        fetchCategories();
      } catch (error) {
        setSuccessMessage("");
        setErrorMessage("An error occurred while deleting the categories. foreign key reference!");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Categories</h1>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Error Message */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Search Input */}
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Category Name"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginRight: "20px" }}
        />
        <a
          href="/addCategory"
          className="btn btn-primary"
          style={{ marginRight: "20px" }}
        >
          Add Category
        </a>
        <a href="/dashboard" className="btn btn-dark">
          Go to Dashboard
        </a>
      </div>

      {/* Bulk delete button */}
      {selectedCategories.length > 0 && (
        <div className="mb-3">
          <button className="btn btn-danger" onClick={handleBulkDelete}>
            Delete Selected Categories
          </button>
        </div>
      )}

      {/* category list */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Selected</th>
            <th>Category Id</th>
            <th>Category Name</th>
            <th>Parent Category</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.category_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.category_id)}
                    onChange={() => handleCheckboxChange(category.category_id)}
                  />
                </td>
                <td>{category.category_id}</td>
                <td>{category.category_name}</td>
                <td>{category.parent_category_name || "No Parent"}</td>
                <td>{category.level}</td>
                <td>
                  <a
                    className="btn btn-success btn-sm mr-2"
                    onClick={() => handleEdit(category.category_id)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(category.category_id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn btn-md ${
              currentPage === i + 1 ? "btn-primary" : "btn-secondary"
            }`}
            style={{ marginRight: "10px" }}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
