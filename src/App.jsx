import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import EditCourse from "./admin/pages/EditCourse";
import CertificateGenerator from "./admin/pages/CertificateGenerator";
import QuestionManager from "./admin/pages/QuestionManager";
import QuizPage from "./admin/pages/QuizPage";
import DeepSeekChat from "./components/DeepSeekChat";

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
        <Route path="/deepSeekChat" element={<DeepSeekChat />} />
        <Route path="lessonslist/:courseId" element={<LessonsList />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/CertificateGenerator/:courseId" element={<CertificateGenerator />} />
        <Route path="/QuizPage/:courseId" element={<QuizPage />} />
        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AddCourses />} />
          {/* Optionally, add a default route for admin, e.g., redirect to dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="editcourse/:courseId" element={<EditCourse />} />
          
          <Route path="question/:courseId" element={<QuestionManager />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
