import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if token exists and if the user has the admin role
  if (token && user && user.role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtectedRoute;