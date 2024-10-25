import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function ProductView() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("pid");
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(
      `http://localhost/react_php_local/backend/product/getProduct.php?pid=${productId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setProduct(data.message);
          setMainImage(data.message.images[0].trim());
        } else {
          setError(data.message || "Product not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  const changeImage = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const toggleLike = () => {
    setLiked((prevLiked) => !prevLiked);
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product: {error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1>{product.product_name}</h1>
      </div>

      <div className="row">
        {/* Main Product Image */}
        <div className="col-md-6">
          <div className="card">
            <img
              id="mainImage"
              src={`http://localhost/react_php_local/backend/images/${mainImage}`}
              className="card-img-top"
              alt="Main Product"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="d-flex justify-content-center mt-3">
            {product.images.map((image, index) => (
              <img
                key={index}
                onClick={() => changeImage(image.trim())}
                src={`http://localhost/react_php_local/backend/images/${image.trim()}`}
                className="img-thumbnail mr-2"
                alt={`Thumbnail ${index + 1}`}
                style={{ width: "100px", height: "100px" }}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          {/* Product Price */}
          <div className="mb-3">
            {product.discount != 0 ? (
              <h3>
                <span
                  className="text-muted"
                  style={{ textDecoration: "line-through" }}
                >
                  ${product.price}
                </span>{" "}
                <span className="text-danger">${product.discount}</span>
              </h3>
            ) : (
              <h3>${product.price}</h3>
            )}
            <span
              className={`badge ${
                product.status === "In Stock" ? "bg-success" : "bg-danger"
              }`}
            >
              {product.status}
            </span>
          </div>

          {/* Product Description */}
          <p>{product.description}</p>

          {/* Quantity Selection */}
          <div className="mb-3">
            <h5>Quantity:</h5>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <button
                  className="btn btn-outline-success"
                  type="button"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
              </div>
              <input
                type="text"
                id="quantity"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-success"
                  type="button"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-3">
            <h5>Color:</h5>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              {[
                "red",
                "blue",
                "green",
                "yellow",
                "black",
                "white",
                "purple",
                "orange",
                "pink",
                "gray",
              ].map((color) => (
                <label
                  key={color}
                  className={`btn btn-outline-primary ${
                    product.color === color ? "active" : ""
                  }`}
                >
                  {color}
                </label>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-3">
            <h5>Size:</h5>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              {[
                "7",
                "8",
                "9",
                "small",
                "medium",
                "large",
                "extra-large",
                "XXL",
              ].map((size) => (
                <label
                  key={size}
                  className={`btn btn-outline-secondary ${
                    product.size === size ? "active" : ""
                  }`}
                >
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <h5>Actions:</h5>
          {product.status === "In Stock" ? (
            <div className="d-flex align-items-center">
              <button
                className="btn btn-primary btn-lg flex-grow-1"
                style={{ marginRight: "10px" }}
              >
                Add to Cart
              </button>

              {/* Heart button to toggle like */}
              <button
                id="likeButton"
                className={`btn ${
                  liked ? "btn-danger" : "btn-outline-danger"
                } rounded-circle`}
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={toggleLike}
              >
                {liked ? "Liked" : <FaHeart />}
              </button>
            </div>
          ) : (
            <div className="alert alert-warning" role="alert">
              Currently, this product is out of stock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductView;
