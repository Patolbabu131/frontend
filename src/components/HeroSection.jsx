import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #424242, #212121)",
        padding: { xs: "40px 20px", md: "0 50px" },
        overflowX: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: { xs: 6, md: 10 },
          px: { xs: 2, md: 10 },
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "50%" },
            pr: { md: 5 },
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ marginRight: "50px" }}
            style={{ textWrap: "balance" }}
            color="#fff"
            gutterBottom
          >
            Unlock Your Potential with SkillVerse
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 3, marginRight: "50px" }}
            style={{ textWrap: "balance" }}
            color="#ddd"
          >
            Learn from industry experts and take your career to the next level with our expertly crafted courses.
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginRight: "50px",
              backgroundColor: "rgb(255, 167, 37)",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgb(230, 150, 30)",
                color: "#fff",
              },
            }}
          >
            Explore Courses
          </Button>
        </Box>

        {/* Right Content (Image + Additional Text) */}
        <Box
          sx={{
            marginRight: "50px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: { xs: "100%", md: "50%" },
            pl: { md: 5 },
          }}
        >
          <img
            src="/img1.jpg"
            alt="Learning"
            style={{
              width: "100%",
              maxWidth: "450px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
            }}
          />
          <Typography
            variant="body1"
            sx={{ mt: 2, fontSize: "18px", px: { xs: 2, md: 0 } }}
            color="#fff"
          >
            Join thousands of learners who are upgrading their skills with high-quality courses designed for success.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
