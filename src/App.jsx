import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AddCourses from "./admin/pages/AddCourses";
import LessonsList from "./admin/pages/LessonsList";
import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Student Side Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="lessonslist/:courseId" element={<LessonsList />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AddCourses />} />
          {/* Optionally, add a default route for admin, e.g., redirect to dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
