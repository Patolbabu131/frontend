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
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Signup successful! Please login.");
      console.log("Registered User:", response.data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed!");
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign-Up Clicked");
    // TODO: Implement Google Sign-Up with Firebase or OAuth
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
              Sign Up
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

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

              {/* Phone Field */}
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
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

              {/* Signup Button */}
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
                Sign Up
              </Button>
            </form>

            {/* OR Divider */}
            <Divider sx={{ my: 3 }}>OR</Divider>

            {/* Google Sign-Up */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleSignUp}
              sx={{
                color: "#ffffff",
                backgroundColor: "rgb(106, 156, 137)",
                border: "none",
                "&:hover": { backgroundColor: "rgb(65, 105, 90)", borderColor: "#ffffff" },
              }}
            >
              Sign up with Google
            </Button>

            {/* Login Redirect */}
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#FF9800",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Login here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Signup;