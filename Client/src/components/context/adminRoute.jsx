import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ element: Component }) => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  console.log("isAuthenticated:", isAuthenticated);
  console.log("userRole:", userRole);

  if (!isAuthenticated || userRole !== "admin") {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }

  // Render the component if authenticated and an admin
  return <Component />;
};

export default AdminRoute;
