import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Ensure token is retrieved
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/user/update",
        { name: user.name, phone: user.phone },
        { headers: { Authorization: `Bearer ${token}` } } // Ensure token is correctly sent
      );

      console.log("Profile updated successfully:", response.data);

      // Update user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect to Profile Page
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 3, borderRadius: "12px", boxShadow: 3, backgroundColor: "rgb(255, 245, 228)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center", color: "rgb(106, 156, 137)" }}>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Name" name="name" value={user.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" name="email" value={user.email} disabled sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone" name="phone" value={user.phone} onChange={handleChange} sx={{ mb: 3 }} />
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "rgb(106, 156, 137)", color: "white", "&:hover": { backgroundColor: "rgb(65, 105, 90)" } }}
              >
                Save Changes
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditProfile;