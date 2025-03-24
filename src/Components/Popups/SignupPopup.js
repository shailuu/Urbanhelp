import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import OTPVerificationPopup from "./OTPVerificationPopup";

function SignupPopup({ onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const { login } = useContext(AuthContext);
  const { username, email, password } = formData;
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
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      // Check if verification is required
      if (data.requiresVerification) {
        // Show OTP verification popup instead of logging in directly
        setShowOTPVerification(true);
      } else {
        // If for some reason verification is not required, proceed with login
        alert("User registered successfully!");
        login({
          token: data.token,
          username: data.user?.username,
          email: data.user?.email,
        });
        onClose();
        navigate("/");
      }
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (data) => {
    // After successful OTP verification
    alert("Email verified successfully!");
    login({
      token: data.token,
      username: data.user?.username,
      email: data.user?.email,
      id: data.user?.id
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
        <h1>Create Your Account</h1>
        <p>Use our services now!</p>
        {error && <p className="error-message">{error}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              required
            />
          </div>
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
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPopup;