import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css"; // Make sure to have matching styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import OTPVerificationPopup from "./OTPVerificationPopup";

function LoginPopup({ onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const { login } = useContext(AuthContext);
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check if verification is required (403 status with requiresVerification flag)
        if (response.status === 403 && data.requiresVerification) {
          setShowOTPVerification(true);
          return;
        }
        throw new Error(data.message || "Login failed");
      }
      
      // Login successful
      login({
        token: data.token,
        username: data.user.username,
        email: data.user.email,
        id: data.user.id
      });
      onClose();
      navigate("/");
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (data) => {
    // After successful OTP verification
    login({
      token: data.token,
      username: data.user.username,
      email: data.user.email,
      id: data.user.id
    });
    onClose();
    navigate("/");
  };

  // If OTP verification is needed, show the OTP popup instead
  if (showOTPVerification) {
    return (
      <OTPVerificationPopup
        email={email}
        onVerified={handleVerified}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>Log In to Your Account</h1>
        <p>Welcome back!</p>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPopup;