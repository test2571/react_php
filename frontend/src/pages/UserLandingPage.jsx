import React, { useEffect, useState } from "react";

function UserLandingPage() {
 const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost/react_php_local/backend/product/featuredProducts.php")
      .then((response) => response.json())
      .then((data) => {
        setFeaturedProducts(data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const testimonials = [
    {
      id: 1,
      avatar: "../../public/media/images.jpg",
      text: "Amazing products! I'm very satisfied with my purchase.",
      author: "John Doe",
    },
    {
      id: 2,
      avatar: "../../public/media/user.png",
      text: "Excellent customer service and quick delivery. Try once",
      author: "Jane Smith",
    },
    {
      id: 3,
      avatar: "../../public/media/user2.png",
      text: "High-quality items at affordable prices. Highly recommend!",
      author: "Sam Wilson",
    },
  ];

  // New promotions data
  const promotions = [
    {
      id: 1,
      title: "20% Off on Summer Collection",
      description: "Limited time offer!",
      imageLink: "../../public/media/20off.webp",
    },
    {
      id: 2,
      title: "Buy 1 Get 1 Free",
      description: "On selected items.",
      imageLink: "../../public/media/buy1.webp",
    },
    {
      id: 3,
      title: "Free Shipping on Orders Over $50",
      description: "Get your items delivered for free!",
      imageLink: "../../public/media/free.jpg",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="container-fluid p-0">
        <div
          className="position-relative"
          style={{ height: "700px", overflow: "hidden" }}
        >
          <img
            src="../../public/media/hero.webp"
            className="img-fluid w-100 h-100"
            style={{ objectFit: "cover", opacity: 0.9 }}
            alt="Hero Banner"
          />
          <div
            className="hero-text position-absolute top-50 start-50 translate-middle text-light text-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <h1
              className="display-4"
              style={{
                fontSize: "3rem",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
              }}
            >
              Welcome to Our Store
            </h1>
            <p
              style={{
                fontSize: "1.5rem",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
              }}
            >
              Your one-stop shop for the latest trends
            </p>
            <a href="#featured" className="btn btn-light btn-lg">
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Promotions Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2>Exclusive Offers</h2>
          <div className="row">
            {promotions.map((promotion) => (
              <div className="col-md-4" key={promotion.id}>
                <div className="card my-3">
                  <img
                    src={promotion.imageLink}
                    className="card-img-top"
                    alt={promotion.title}
                    style={{
                      objectFit: "cover",
                      height: "360px",
                      width: "100%",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{promotion.title}</h5>
                    <p className="card-text">{promotion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-5">
        <div className="container text-center">
          <h2>Featured Products</h2>
          <div className="row">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div className="col-sm-6 col-md-3" key={product.id}>
                  <div className="card my-3" style={{ height: "400px" }}>
                    <img
                      src={`http://localhost/react_php_local/backend/images/${product.imageLink}`}
                      className="card-img-top"
                      alt={product.name}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "1.1em",
                          overflowWrap: "break-word",
                        }}
                      >
                        {product.name}
                      </h5>
                      <p className="card-text">
                        {product.discount != 0 ? (
                          <>
                            <span style={{ textDecoration: "line-through" }}>
                              ${product.price}
                            </span>
                            <br />
                            <span style={{ color: "red" }}>
                              ${product.discount}
                            </span>
                          </>
                        ) : (
                          <span>${product.price}</span>
                        )}
                      </p>
                      <a
                        href={`http://localhost:5173/user/productView?pid=${product.id}`}
                        className="btn btn-primary mt-auto"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">What Our Customers Say</h2>
          <div className="row">
            {testimonials.map((testimonial) => (
              <div className="col-md-4" key={testimonial.id}>
                <div className="card my-3 shadow border-0">
                  <div className="card-body">
                    <div className="testimonial-avatar mb-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="rounded-circle"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <p className="card-text text-muted">
                      <i className="fas fa-quote-left"></i>"{testimonial.text}"
                      <i className="fas fa-quote-right"></i>
                    </p>
                    <footer className="blockquote-footer mt-2">
                      <cite title="Source Title">{testimonial.author}</cite>
                    </footer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2>Join Our Newsletter</h2>
          <p>Subscribe to get the latest offers and updates.</p>
          <form className="d-flex justify-content-center">
            <input
              type="email"
              className="form-control me-2"
              placeholder="Enter your email"
              required
            />
            <button className="btn btn-primary" type="button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default UserLandingPage;
