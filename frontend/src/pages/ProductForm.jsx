import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { productValidation } from "./../utils/product/productValidation.js";

function ProductForm() {
  const [serachParams] = useSearchParams();
  const pid = serachParams.get("pid");

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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [allImagesDeleted, setAllImagesDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/react_php_local/backend/category/categories.php")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (pid) {
      fetch(
        `http://localhost/react_php_local/backend/product/getProduct.php?pid=${pid}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setFormData({
              productName: data.message.product_name || "",
              sku: data.message.sku || "",
              color: data.message.color || "",
              size: data.message.size || "",
              description: data.message.description || "",
              images: data.message.images || [],
              category: data.message.category || "",
              price: data.message.price || "",
              discount: data.message.discount || "",
              stockQuantity: data.message.stock_quantity || 0,
              mfrCost: data.message.mfr_cost || "",
              shippingCost: data.message.shipping_cost || "",
              minPrice: data.message.min_price || "",
              status: data.message.status || "In Stock",
            });
          } else {
            setMessage("Product not found!");
          }
        })
        .catch((error) => {
          console.error("Error fetching product data: ", error);
          setMessage("Error fetching product data.");
        });
    }
  }, [pid]);

  const handleChange = (e) => {
    const { name, value, files: selectedFiles } = e.target;
    if (name === "images") {
      setFiles(selectedFiles);

      // preview images
      const fileArray = Array.from(selectedFiles);
      const previewUrls = fileArray.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      });

      Promise.all(previewUrls).then((urls) => setImagePreviews(urls));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDeleteImage = (image) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (confirmDelete) {
      const productId = pid;

      fetch(
        `http://localhost/react_php_local/backend/product/deleteImage.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, image }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setFormData((prevData) => {
              const updatedImages = prevData.images.filter(
                (img) => img !== image
              );
              setAllImagesDeleted(updatedImages.length === 0);
              return {
                ...prevData,
                images: updatedImages,
              };
            });
            setImageMessage("Image deleted successfully!");
          } else {
            setImageMessage(data.message || "Failed to delete image.");
          }
        })
        .catch((error) => {
          console.error("Error deleting image:", error);
          setImageMessage("Error deleting image. Please try again.");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    if (formData.stockQuantity === "0") {
      setFormData({
        ...formData,
        status: "Out Of Stock",
      });
      alert("Stock is 0. Status set to 'Out Of Stock'.");
    }
    const productValidationErrors = productValidation(formData);
    setErrors(productValidationErrors);

    if (Object.keys(productValidationErrors).length === 0) {
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

      if (pid) {
        formDataWithFiles.append("pid", pid);
      }

      fetch(`http://localhost/react_php_local/backend/product/addProduct.php`, {
        method: "POST",
        body: formDataWithFiles,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            if (pid) {
              setMessage("Product Updated successfully!");
            } else {
              setMessage("Product added successfully!");
            }
            setTimeout(() => {
              navigate("/viewProduct");
            }, 2000);
          } else {
            setMessage(data.message);
            setLoading(false);
            setErrors({});
          }
        })
        .catch((error) => {
          setMessage("Failed to add product. Please try again.");
          setLoading(false);
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h1 className="text-center mb-4">
              {pid ? "Edit Product" : "Add Product"}
            </h1>
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
                {errors.productName && (
                  <small className="text-danger">{errors.productName}</small>
                )}
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
                  placeholder="Enter Product Sku"
                />
                {errors.sku && (
                  <small className="text-danger">{errors.sku}</small>
                )}
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
                {errors.color && (
                  <small className="text-danger">{errors.color}</small>
                )}
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
                {errors.size && (
                  <small className="text-danger">{errors.size}</small>
                )}
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
                {errors.description && (
                  <small className="text-danger">{errors.description}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="images" className="form-label">
                  Images :
                </label>
                <input
                  type="file"
                  id="images"
                  required={!pid || allImagesDeleted}
                  onChange={handleChange}
                  multiple
                  name="images"
                  className="form-control"
                />
              </div>
              <div id="image-preview-react" className="mb-3">
                {formData.images &&
                  formData.images.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      style={{
                        display: "inline-block",
                        margin: "10px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={`http://localhost/react_php_local/backend/images/${image}`}
                        alt={`Existing ${index}`}
                        style={{ maxWidth: "100px", height: "auto" }}
                      />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => handleDeleteImage(image)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "red",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                <div>
                  {imageMessage && (
                    <small
                      className={` ${
                        imageMessage.includes("success")
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {imageMessage}
                    </small>
                  )}
                </div>
              </div>
              {/* Image Previews */}
              <div id="image-preview-react" className="mb-3">
                {imagePreviews.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      display: "inline-block",
                      margin: "10px",
                      position: "relative",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  </div>
                ))}
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
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  name="price"
                  className="form-control"
                  placeholder="Enter Price here"
                />
                {errors.price && (
                  <small className="text-danger">{errors.price}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="discount" className="form-label">
                  Discount Price :
                </label>
                <input
                  type="number"
                  id="discount"
                  min={0}
                  step="0.01"
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
                <div>
                  {errors.discount && (
                    <small className="text-danger">{errors.discount}</small>
                  )}
                </div>
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
                {errors.stockQuantity && (
                  <small className="text-danger">{errors.stockQuantity}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="mfrCost" className="form-label">
                  Manufacturer Cost :
                </label>
                <input
                  type="number"
                  id="mfrCost"
                  min={0}
                  step="0.01"
                  required
                  value={formData.mfrCost}
                  onChange={handleChange}
                  name="mfrCost"
                  className="form-control"
                  placeholder="Enter Manufacturer Cost here"
                />
                {errors.mfrCost && (
                  <small className="text-danger">{errors.mfrCost}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="shippingCost" className="form-label">
                  Shipping Cost :
                </label>
                <input
                  type="number"
                  id="shippingCost"
                  min={0}
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={handleChange}
                  required
                  name="shippingCost"
                  className="form-control"
                  placeholder="Enter Shipping Cost here"
                />
                {errors.shippingCost && (
                  <small className="text-danger">{errors.shippingCost}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="minPrice" className="form-label">
                  Min Price :
                </label>
                <input
                  type="number"
                  id="minPrice"
                  min={1}
                  step="0.01"
                  required
                  value={formData.minPrice}
                  onChange={handleChange}
                  name="minPrice"
                  className="form-control"
                  placeholder="Enter Min Price here"
                />
                {errors.minPrice && (
                  <small className="text-danger">{errors.minPrice}</small>
                )}
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
                  {loading
                    ? "Loading..."
                    : pid
                    ? "Update Product"
                    : "Add Product"}{" "}
                </button>
              </div>
              <div>
                {message && (
                  <div
                    className={`alert mt-3 ${
                      message.includes("success")
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </form>
            <div className="mt-4 text-center">
              {allImagesDeleted ? (
                <p className="text-danger">
                  All images have been deleted. You cannot return to the
                  dashboard for this product.
                </p>
              ) : (
                <Link
                  to="/dashboard"
                  className="text-decoration-none text-white bg-dark p-2 rounded"
                >
                  Back to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
