// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";

// Placeholder components for the remaining pages
const DashboardPage = () => (
  <div className="page-content">Dashboard Page Content</div>
);
const AssessmentPage = () => (
  <div className="page-content">Assessment Page Content</div>
);
const ResultsPage = () => (
  <div className="page-content">Results Page Content</div>
);
const ProfilePage = () => (
  <div className="page-content">Profile Page Content</div>
);

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/assessment/:id" element={<AssessmentPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
