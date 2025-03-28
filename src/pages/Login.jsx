import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Hook for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user details

        window.dispatchEvent(new Event("storage")); // Update Navbar
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Clicked");
    // TODO: Implement Google Sign-In with Firebase or OAuth
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, rgb(255, 245, 228), rgb(193, 216, 195))",
        padding: "20px",
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ padding: 4, boxShadow: 3, borderRadius: "12px", backgroundColor: "white" }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
              Login
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#FF9800",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  mt: 2,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#E65100" },
                }}
              >
                Login
              </Button>
            </form>

            {/* OR Divider */}
            <Divider sx={{ my: 3 }}>OR</Divider>

            {/* Google Sign-in */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleSignIn}
              sx={{
                color: "#ffffff",
                backgroundColor: "rgb(106, 156, 137)",
                border: "none",
                "&:hover": { backgroundColor: "rgb(65, 105, 90)", borderColor: "#ffffff" },
              }}
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;