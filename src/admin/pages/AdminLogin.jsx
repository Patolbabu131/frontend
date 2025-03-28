import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../assets/config"; // Adjust the import based on your project structure
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
    
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    
            if (response.data && response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("isAdminAuthenticated", "true");
                if (response.data.user && response.data.user.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/admin/login"); // redirect non-admin users to a different page if required
                }
            } else {
                // If the backend indicates failure, show the message
                const message = response.data && response.data.message
                    ? response.data.message
                    : "Login failed, please try again.";
                setError(message);
            }
        } catch (err) {
            // If axios throws an error (e.g., network error), handle it here
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    };
    
    
    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Admin Login
                </Typography>

                {error && <Typography color="error" align="center">{error}</Typography>}

                <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField 
                        label="Email" 
                        variant="outlined" 
                        fullWidth 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <TextField 
                        label="Password" 
                        type="password" 
                        variant="outlined" 
                        fullWidth 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminLogin;