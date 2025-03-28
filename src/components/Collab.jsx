import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";

const companies = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg" },
  { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" },
  { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/1920px-Oracle_logo.svg.png" },
  { name: "Adobe", logo: "https://1000logos.net/wp-content/uploads/2021/04/Adobe-logo.png" },
];

const Collab = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
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
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "45%" },
            mr: { md: "50px" },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 2 }}
            style={{ textWrap: "balance" }}
            color="#fff"
          >
            Partnering with Top-Tier Companies!
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 3, mr: "50px" }}
            style={{ textWrap: "balance" }}
            color="#ddd"
          >
            We collaborate with leading global companies to provide high-quality study materials, real-world projects, and exclusive job opportunities for our learners.
          </Typography>
        </Box>

        {/* Right Content (Logos with Glassmorphism) */}
        <Grid container spacing={2} sx={{ flex: 1, justifyContent: "center", mr: "40px" }}>
          {companies.map((company, index) => (
            <Grid item xs={6} sm={4} md={4} key={index}>
              <Paper
                sx={{
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.6)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Collab;
