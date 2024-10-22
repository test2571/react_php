import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const recordsPerPage = 5;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost/react_php_local/backend/product/productList.php?page=${currentPage}&searchQuery=${searchQuery}`
      );
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.totalProducts / recordsPerPage));
    } catch (error) {
      setErrorMessage("An error occurred while fetching products.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (productId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmation) {
      try {
        const response = await fetch(
          `http://localhost/react_php_local/backend/product/productDelete.php?pid=${productId}`,
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

        fetchProducts();
      } catch (error) {
        setSuccessMessage("");
        setErrorMessage("An error occurred while deleting the product!");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Products</h1>

      {/* Success Message */}
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
          placeholder="Search by Product Name"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginRight: "20px" }}
        />
        <a
          href="/addProduct"
          className="btn btn-primary"
          style={{ marginRight: "20px" }}
        >
          Add Product
        </a>
        <a href="/dashboard" className="btn btn-dark">
          Go to Dashboard
        </a>
      </div>

      {/* Product List */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Image</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.sku}</td>
                <td>
                  <div className="d-flex flex-wrap">
                    {product.image_link.split(",").map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost/react_php_local/backend/images/${image}`}
                        alt={`${product.product_name}-${index}`}
                        style={{
                          width: "100px",
                          height: "auto",
                          marginRight: "10px",
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td>{product.price}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No products found
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

export default ProductList;
