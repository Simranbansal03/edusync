// src/components/common/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-circle">E</div>
          <span>EduSync</span>
        </Link>

        <div className="navbar-search">
          <input type="text" placeholder="Search" />
          <button className="search-icon">
            <i className="fas fa-search">🔍</i>
          </button>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/login" className="btn">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
