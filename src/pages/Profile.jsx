import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Avatar, Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {user && (
        <Card
          sx={{
            p: 3,
            borderRadius: "12px",
            boxShadow: 3,
            background: "linear-gradient(135deg, rgb(255, 245, 228), rgb(193, 216, 195))",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "auto",
              backgroundColor: "rgb(106, 156, 137)",
              fontSize: "32px",
              color: "white",
            }}
          >
            {user.name[0].toUpperCase()}
          </Avatar>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "rgb(106, 156, 137)", mb: 2 }}>
              {user.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "rgb(100, 100, 100)", mb: 1 }}>
              Email: {user.email}
            </Typography>
            {user.phone && (
              <Typography variant="body1" sx={{ color: "rgb(100, 100, 100)", mb: 1 }}>
                Phone: {user.phone}
              </Typography>
            )}
            
            {/* Buttons Section */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "rgb(106, 156, 137)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgb(65, 105, 90)" },
                }}
                onClick={() => navigate("/courses")}
              >
                Browse Courses
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "rgb(255, 140, 60)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgb(220, 100, 20)" },
                }}
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Profile;