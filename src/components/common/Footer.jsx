// src/components/common/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <div className="logo-circle">E</div>
          <span>EduSync</span>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h3>Platform</h3>
            <ul>
              <li>
                <Link to="/courses">Courses</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/assessments">Assessments</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} EduSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
