// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>
              Learn New <br />
              Skills Everyday
            </h1>
            <p>
              Platform as learning media to be able to improve various skills
              you want in an easy and effective way for anywhere and anytime
            </p>
            <div className="hero-buttons">
              <Link to="/courses" className="btn">
                Explore Courses
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Get Started
              </Link>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                Professional Mentorship
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                Certificate International
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-grid">
              <div className="image-box box1"></div>
              <div className="image-box box2"></div>
              <div className="image-box box3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Our Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-large">📚</div>
              <h3>Comprehensive Courses</h3>
              <p>Access a wide range of courses designed by industry experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">🎯</div>
              <h3>Interactive Assessments</h3>
              <p>Test your knowledge with engaging quizzes and assignments</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your learning journey with detailed analytics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">🏆</div>
              <h3>Certifications</h3>
              <p>Earn recognized certifications to showcase your skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses">
        <div className="container">
          <h2 className="section-title">Popular Courses</h2>
          <div className="courses-grid">
            {/* This would be dynamically populated from your API */}
            {[1, 2, 3].map((item) => (
              <div className="course-card" key={item}>
                <div className="course-image"></div>
                <div className="course-content">
                  <span className="course-category">Development</span>
                  <h3>Introduction to Web Development</h3>
                  <div className="course-meta">
                    <span>12 lessons</span>
                    <span>⭐ 4.8</span>
                  </div>
                  <Link to={`/courses/${item}`} className="btn">
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/courses" className="btn btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>
              Join thousands of students and start improving your skills today
            </p>
            <Link to="/register" className="btn">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
