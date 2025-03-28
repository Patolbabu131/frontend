import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    window.addEventListener("storage", () => setUser(JSON.parse(localStorage.getItem("user"))));
    return () => window.removeEventListener("storage", () => {});
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    handleMenuClose();
    navigate("/");
  };

  return (
    <>
      <AppBar
        sx={{
          background: "linear-gradient(135deg, #424242, #212121)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: "1px",
              color: "#fff",
              cursor: "pointer",
              textDecoration: "none",
            }}
            component={Link}
            to="/"
          >
            SkillVerse
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            <Button component={Link} to="/" sx={menuButtonStyles}>
              Home
            </Button>
            <Button component={Link} to="/courses" sx={menuButtonStyles}>
              Courses
            </Button>

            {/* User Menu */}
            {user ? (
              <>
                <Button onClick={handleMenuOpen} sx={menuButtonStyles}>
                  {user.name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    mt: 1,
                    "& .MuiPaper-root": {
                      backgroundColor: "#424242",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={menuItemStyles}>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ ...menuItemStyles, color: "#f44336" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={menuButtonStyles}>
                  Login
                </Button>
                <Button component={Link} to="/signup" sx={menuButtonStyles}>
                  Signup
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: "block", md: "none" }, outline: "none" }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon sx={{ fontSize: "30px", color: "#fff" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Sidebar */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" sx={{ color: "#212121" }} />
            </ListItem>
            <ListItem button component={Link} to="/courses">
              <ListItemText primary="Courses" sx={{ color: "#212121" }} />
            </ListItem>

            {user ? (
              <>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="My Profile" sx={{ color: "#212121" }} />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" sx={{ color: "#f44336" }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemText primary="Login" sx={{ color: "#212121" }} />
                </ListItem>
                <ListItem button component={Link} to="/signup">
                  <ListItemText primary="Signup" sx={{ color: "#212121" }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

// Dark Theme Styles
const menuButtonStyles = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textTransform: "uppercase",
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
  },
};

const menuItemStyles = {
  fontWeight: "600",
  padding: "10px 20px",
  color: "#fff",
  "&:hover": { backgroundColor: "#616161", color: "#fff" },
};

export default Navbar;
