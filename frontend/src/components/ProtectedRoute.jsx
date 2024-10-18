import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");

    if (!adminId) {
      navigate("/");
    }

    const handleStorageChange = () => {
      const updatedAdminId = localStorage.getItem("adminId");

      if (!updatedAdminId) {
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return children;
}

export default ProtectedRoute;
