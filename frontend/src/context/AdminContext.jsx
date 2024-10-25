import { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(localStorage.getItem("adminId"));
  const [adminDetails, setAdminDetails] = useState({
    admin_id: "",
    username: "",
    email: "",
    full_name: "",
    phone_no: "",
    status: "",
  });

  const updateAdminDetails = (updatedDetails) => {
    setAdminDetails(updatedDetails);
  };

  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (adminId) {
        try {
          const response = await fetch(
            "http://localhost/react_php_local/backend/admin/getAdminDetails.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ adminId }),
            }
          );

          const data = await response.json();
          if (response.ok && data.status === "success") {
            setAdminDetails({
              admin_id: data.adminDetails.admin_id || "",
              username: data.adminDetails.username || "",
              email: data.adminDetails.email || "",
              full_name: data.adminDetails.full_name || "",
              phone_no: data.adminDetails.phone_no || "",
              status: data.adminDetails.status || "",
            });
          } else {
            setAdminDetails({
              admin_id: "",
              username: "",
              email: "",
              full_name: "",
              phone_no: "",
              status: "",
            });
          }
        } catch (error) {
          setAdminDetails({
            admin_id: "",
            username: "",
            email: "",
            full_name: "",
            phone_no: "",
            status: "",
          });
        }
      } else {
        setAdminDetails({
          admin_id: "",
          username: "",
          email: "",
          full_name: "",
          phone_no: "",
          status: "",
        });
      }
    };

    fetchAdminDetails();
  }, [adminId]);

  const handleLoginContext = (newAdminId) => {
    setAdminId(newAdminId);
    localStorage.setItem("adminId", newAdminId);
  };

  const handleLogoutContext = () => {
    setAdminId(null);
    localStorage.removeItem("adminId");
    setAdminDetails({
      admin_id: "",
      username: "",
      email: "",
      full_name: "",
      phone_no: "",
      status: "",
    });
  };

  return (
    <AdminContext.Provider
      value={{
        adminDetails,
        handleLoginContext,
        handleLogoutContext,
        updateAdminDetails,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
