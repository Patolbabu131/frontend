import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ isMobile, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{ background: " #424242" }}
      
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Button color="inherit" onClick={() => navigate("/admin/courses")}>
          Manage Courses
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
