import React from "react";
import { Grid, Typography, Container, Box } from "@mui/material";
import CourseCard from "./adminCourseCard";

// Sample Data for Courses
const courses = [
  {
    image: "/img1.jpg",
    university: "Texas - McCombs",
    name: "Post Graduate Program in Data Science",
    duration: "12 months",
    mode: "Online",
    rating: "4.8/5",
    learners: "14000",
    link: "#",
  },
  {
    image: "/img1.jpg",
    university: "Harvard University",
    name: "Advanced Web Development Bootcamp",
    duration: "6 months",
    mode: "Online",
    rating: "4.9/5",
    learners: "20000",
    link: "#",
  },
  {
    image: "/img1.jpg",
    university: "MIT",
    name: "Full-Stack Web Development with React & Node.js",
    duration: "9 months",
    mode: "Hybrid",
    rating: "4.7/5",
    learners: "12000",
    link: "#",
  },
  {
    image: "/img1.jpg",
    university: "MIT",
    name: "Full-Stack Web Development with React & Node.js",
    duration: "9 months",
    mode: "Hybrid",
    rating: "4.7/5",
    learners: "12000",
    link: "#",
  },
  {
    image: "/img1.jpg",
    university: "MIT",
    name: "Full-Stack Web Development with React & Node.js",
    duration: "9 months",
    mode: "Hybrid",
    rating: "4.7/5",
    learners: "12000",
    link: "#",
  },
  {
    image: "/img1.jpg",
    university: "MIT",
    name: "Full-Stack Web Development with React & Node.js",
    duration: "9 months",
    mode: "Hybrid",
    rating: "4.7/5",
    learners: "12000",
    link: "#",
  },
];

const adminCoursesSection = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, rgb(255, 245, 228), rgb(193, 216, 195))",
        py: 5,
      }}
    >
      <Container sx={{ textAlign: "center"}}>
        <Typography variant="h4" fontWeight="bold" color="rgb(106, 156, 137)" sx={{ mb: 3 }}>
          Courses
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default adminCoursesSection;