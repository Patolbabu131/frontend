import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import AdminNavbar from "./AdminNavbar";
import CoursesCard from "./CoursesCard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  useEffect(() => {
    // Set a timer to log out after 1 hour (3600000ms)
    const timer = setTimeout(() => {
      handleLogout();
    }, 3600000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <AdminNavbar isMobile={isMobile} handleLogout={handleLogout} />
      <CoursesCard />

    </Box>
  );
};

export default AdminDashboard;
