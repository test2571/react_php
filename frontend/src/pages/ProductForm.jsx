import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductForm() {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    color: "",
    size: "",
    description: "",
    images: [],
    category: "",
    price: "",
    discount: "",
    stockQuantity: "",
    mfrCost: "",
    shippingCost: "",
    minPrice: "",
    status: "In Stock",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/react_php_local/backend/category/categories.php")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files: selectedFiles } = e.target;
    if (name === "images") {
      setFiles(selectedFiles);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const adminId = localStorage.getItem("adminId");

    const formDataWithFiles = new FormData();
    formDataWithFiles.append("adminId", adminId);

    Object.keys(formData).forEach((key) => {
      formDataWithFiles.append(key, formData[key]);
    });

    for (let i = 0; i < files.length; i++) {
      formDataWithFiles.append("images[]", files[i]);
    }

    fetch(`http://localhost/react_php_local/backend/product/addProduct.php`, {
      method: "POST",
      body: formDataWithFiles,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage(data.message);
          navigate("/dashboard");
        } else {
          setMessage(data.message);
          setLoading(false);
          setFormData({
            productName: "",
            sku: "",
            color: "",
            size: "",
            description: "",
            images: [],
            category: "",
            price: "",
            discount: "",
            stockQuantity: "",
            mfrCost: "",
            shippingCost: "",
            minPrice: "",
            status: "In Stock",
          });
          setFiles([]);
        }
      })
      .catch((error) => {
        setMessage("Failed to add product. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h1 className="text-center mb-4">Add Product</h1>
            {message && (
              <div
                className={`alert ${
                  message.includes("success") ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="productName" className="form-label">
                  Product Name :
                </label>
                <input
                  type="text"
                  id="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  name="productName"
                  className="form-control"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="sku" className="form-label">
                  SKU :
                </label>
                <input
                  type="text"
                  id="sku"
                  required
                  value={formData.sku}
                  onChange={handleChange}
                  name="sku"
                  className="form-control"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Color :
                </label>
                <select
                  id="color"
                  required
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  className="form-select"
                >
                  <option value="">Select Color</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="pink">Pink</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="size" className="form-label">
                  Size :
                </label>
                <select
                  id="size"
                  required
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Size</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description :
                </label>
                <textarea
                  id="description"
                  required
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Description Here"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="images" className="form-label">
                  Images :
                </label>
                <input
                  type="file"
                  id="images"
                  required
                  onChange={handleChange}
                  multiple
                  name="images"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Select Category :
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  name="category"
                  className="form-select"
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {"--".repeat(category.level)} {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price :
                </label>
                <input
                  type="number"
                  id="price"
                  min={1}
                  required
                  value={formData.price}
                  onChange={handleChange}
                  name="price"
                  className="form-control"
                  placeholder="Enter Price here"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="discount" className="form-label">
                  Discount Price :
                </label>
                <input
                  type="number"
                  id="discount"
                  min={0}
                  value={formData.discount}
                  onChange={handleChange}
                  required
                  name="discount"
                  className="form-control"
                  placeholder="Enter Discount Price here"
                />
                <small id="discountHelp" className="form-text text-muted">
                  Enter 0 if there is no discount.
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="stockQuantity" className="form-label">
                  Stock Quantity :
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  min={0}
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  name="stockQuantity"
                  className="form-control"
                  placeholder="Enter Stock Quantity here"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mfrCost" className="form-label">
                  Manufacturer Cost :
                </label>
                <input
                  type="number"
                  id="mfrCost"
                  min={0}
                  required
                  value={formData.mfrCost}
                  onChange={handleChange}
                  name="mfrCost"
                  className="form-control"
                  placeholder="Enter Manufacturer Cost here"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="shippingCost" className="form-label">
                  Shipping Cost :
                </label>
                <input
                  type="number"
                  id="shippingCost"
                  min={0}
                  value={formData.shippingCost}
                  onChange={handleChange}
                  required
                  name="shippingCost"
                  className="form-control"
                  placeholder="Enter Shipping Cost here"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="minPrice" className="form-label">
                  Min Price :
                </label>
                <input
                  type="number"
                  id="minPrice"
                  min={1}
                  required
                  value={formData.minPrice}
                  onChange={handleChange}
                  name="minPrice"
                  className="form-control"
                  placeholder="Enter Min Price here"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out Of Stock">Out Of Stock</option>
                </select>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;