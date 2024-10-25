import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryMenu from "../components/CategoryMenu.jsx";
import Spinner from "../components/Spinner.jsx";

function ProductsByCategory() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      fetch(
        `http://localhost/react_php_local/backend/product/productByCategory.php?cid=${categoryId}`
      )
        .then((response) => response.json())
        .then((data) => {
          setProducts(data.products);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <CategoryMenu />
      <div className="d-flex justify-content-end me-5">
        <a href="http://localhost:5173/user">
          <button type="button" class="btn btn-success">
            Go to Home Page
          </button>
        </a>
      </div>
      <div className="container my-5">
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col-md-3 col-lg-4 mb-5" key={product.product_id}>
                <div className="card h-100">
                  <img
                    src={`http://localhost/react_php_local/backend/images/${product.image_link}`}
                    alt={product.product_name}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ fontSize: "1.25rem" }}>
                      {product.product_name}
                    </h5>
                    <p className="card-text" style={{ fontSize: "1.1rem" }}>
                      {product.discount && product.discount > 0 ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              marginRight: "8px",
                            }}
                          >
                            ${product.price}
                          </span>
                          <span style={{ color: "red" }}>
                            ${product.discount}
                          </span>
                        </>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </p>
                    <a
                      href={`http://localhost:5173/user/productView?pid=${product.product_id}`}
                      className="btn btn-primary mt-auto"
                      style={{ fontSize: "1rem", padding: "10px 15px" }}
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <h1>No products found for this category.</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductsByCategory;
