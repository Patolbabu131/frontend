import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(135deg, #1c1c1c, #333333)",
        color: "white",
        py: 6,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Courses Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Courses
            </Typography>
            {["Web Development", "Data Science", "AI & Machine Learning", "Cloud Computing", "Cyber Security"].map((course, index) => (
              <Link
                key={index}
                href="#"
                color="inherit"
                display="block"
                underline="hover"
                sx={{ transition: "color 0.3s", "&:hover": { color: "#FFD700" } }}
              >
                {course}
              </Link>
            ))}
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            {["About Us", "Contact Us", "Login", "Register", "FAQ"].map((link, index) => (
              <Link
                key={index}
                href="#"
                color="inherit"
                display="block"
                underline="hover"
                sx={{ transition: "color 0.3s", "&:hover": { color: "#FFD700" } }}
              >
                {link}
              </Link>
            ))}
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              📍 123 Learning Street, GJ, IN
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              📞 +91 7228890306
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              ✉️ support@SkillVersewebsite.com
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, index) => (
                <IconButton
                  key={index}
                  href="#"
                  sx={{
                    color: "white",
                    transition: "transform 0.3s, color 0.3s",
                    "&:hover": { transform: "scale(1.2)", color: "#FFD700" },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Divider & Copyright */}
        <Box sx={{ textAlign: "center", mt: 5, opacity: 0.8 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Skill Website. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
