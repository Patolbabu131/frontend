import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const CourseCard = ({ course }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        overflow: "hidden",
        backgroundColor: "#fff",
        cursor: 'pointer', // Added cursor style
      }}
    >
      {/* Course Image */}
      <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
        <img
          src={course.image}
          alt={course.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            color: "rgb(229, 229, 229)",
            backgroundColor: "rgb(106, 156, 137)",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {course.university}
        </Box>
      </Box>

      {/* Course Details */}
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {course.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {course.duration} • {course.mode}
        </Typography>

        {/* Rating */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            color: "rgba(0, 0, 0, 0.51)",
            fontSize: "12px",
            fontWeight: "bold",
            padding: "5px",
            borderRadius: "5px",
            display: "inline-block",
            mt: 1,
          }}
        >
          ⭐ Rated {course.rating} by {course.learners}+ learners
        </Box>

        {/* View Program Button */}
        <Button
          sx={{
            mt: 2,
            textTransform: "none",
            color: "rgba(0, 0, 0, 0.63)",
            fontWeight: "bold",
            "&:hover": {
                backgroundColor: "#ffffff",
                color: "rgba(0, 0, 0, 0.63)",
              },
          }}
          href={course.link}
        >
          View Program
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
