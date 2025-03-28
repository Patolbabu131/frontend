import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const CertificationSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #424242, #212121)",
        padding: { xs: "50px 20px", md: "80px 50px" },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: { xs: 6, md: 8 },
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            m: "50px",
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "45%" },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#fff"
            sx={{ mb: 2 }}
          >
            Earn Your Certificate & Unlock New Opportunities!
          </Typography>
          <Typography
            variant="h6"
            color="#ddd"
            sx={{ m: "50px", mb: 3 }}
          >
            Get an industry-recognized certificate upon completion and take the next step in your career.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mr: "50px",
              backgroundColor: "rgb(255, 167, 37)",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              p: "10px 20px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgb(230, 150, 30)",
                color: "#fff",
              },
            }}
          >
            Get Certified Now
          </Button>
        </Box>

        {/* Right Content (Image + Glassmorphism Card) */}
        <Box
          sx={{
            m: "50px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Certificate Image */}
          <img
            src="/img1.jpg" // Change to actual image path
            alt="Certification"
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "12px",
              boxShadow: "0px 6px 14px rgba(0,0,0,0.7)",
            }}
          />

          {/* Glassmorphism Card */}
          <Box
            sx={{
              position: "absolute",
              bottom: "-30px",
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(15px)",
              borderRadius: "12px",
              p: "16px 24px",
              width: "80%",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ m: "50px" }}
              color="#fff"
            >
              🎉 95% of learners see career growth after certification!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CertificationSection;
