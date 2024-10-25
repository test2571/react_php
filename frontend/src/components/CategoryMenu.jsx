import React, { useEffect, useState } from "react";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost/react_php_local/backend/category/categories.php"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const renderDropdown = (parentId, isTopLevel = false) => {
    return (
      <ul
        className="dropdown-menu"
        style={{
          display: "none",
          position: "absolute",
          backgroundColor: "#f9f9f9",
          minWidth: "160px",
          zIndex: 1000,
          padding: "0",
          margin: "0",
          listStyleType: "none",
          left: isTopLevel ? "0" : "100%",
          top: isTopLevel ? "auto" : "0",
        }}
      >
        {categories
          .filter((category) => category.parent_id === parentId)
          .map((child) => (
            <li
              key={child.category_id}
              style={{ position: "relative" }}
              onMouseEnter={(e) => {
                const dropdown =
                  e.currentTarget.querySelector(".dropdown-menu");
                if (dropdown) dropdown.style.display = "block";
              }}
              onMouseLeave={(e) => {
                const dropdown =
                  e.currentTarget.querySelector(".dropdown-menu");
                if (dropdown) dropdown.style.display = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <a
                  style={{
                    display: "block",
                    padding: "8px 16px",
                    color: "#000",
                    textDecoration: "none",
                  }}
                  href={`http://localhost:5173/user/productsbycategory?cid=${child.category_id}`}
                >
                  {child.category_name}
                </a>
                {categories.some(
                  (grandchild) => grandchild.parent_id === child.category_id
                ) && (
                  <span
                    className="dropdown-toggle"
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const dropdown = e.currentTarget.nextElementSibling;
                      if (dropdown) {
                        dropdown.style.display =
                          dropdown.style.display === "block" ? "none" : "block";
                      }
                    }}
                  ></span>
                )}
              </div>
              {renderDropdown(child.category_id)}{" "}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light mb-4"
      style={{ backgroundColor: "#1E3E62" }}
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul
            className="navbar-nav"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {categories
              .filter((category) => category.parent_id === null)
              .map((category) => (
                <li
                  key={category.category_id}
                  className="nav-item dropdown"
                  style={{ position: "relative", flex: "1" }}
                  onMouseEnter={(e) => {
                    const dropdown =
                      e.currentTarget.querySelector(".dropdown-menu");
                    if (dropdown) dropdown.style.display = "block";
                  }}
                  onMouseLeave={(e) => {
                    const dropdown =
                      e.currentTarget.querySelector(".dropdown-menu");
                    if (dropdown) dropdown.style.display = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <a
                      className="nav-link dropdown-toggle"
                      href={`http://localhost:5173/user/productsbycategory?cid=${category.category_id}`}
                      id={`navbarDropdown${category.category_id}`}
                      role="button"
                      style={{ color: "#ffffff" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {category.category_name}
                    </a>
                  </div>
                  {renderDropdown(category.category_id, true)}{" "}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CategoryMenu;
