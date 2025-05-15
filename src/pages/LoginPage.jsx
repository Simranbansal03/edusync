// src/pages/LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPages.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        // Here you would call your authentication API
        // For now, we'll just simulate a successful login
        console.log("Login form submitted:", formData);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store auth token (would come from your API)
        localStorage.setItem("authToken", "sample-auth-token");

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ form: "Invalid email or password" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to EduSync</p>
          </div>

          {errors.form && <div className="auth-error">{errors.form}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-auth">
            <button className="social-button google">
              <i className="fab fa-google"></i> Sign in with Google
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>

        <div className="auth-image">
          <div className="auth-overlay">
            <div className="auth-quote">
              <h3>
                "Education is the passport to the future, for tomorrow belongs
                to those who prepare for it today."
              </h3>
              <p>- Malcolm X</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
