import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import "./SignupPopup.css"; // Reuse existing styles

function OTPVerificationPopup({ email, onVerified, onClose, onResendOTP }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }
      
      // Call the onVerified callback with user data and token
      onVerified({
        token: data.token,
        user: data.user
      });
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5001/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }
      
      alert("A new verification code has been sent to your email.");
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>Verify Your Email</h1>
        <p>We've sent a verification code to {email}.</p>
        <p>Please enter the code below to complete your registration.</p>
        
        {error && <p className="error-message">{error}</p>}
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="text"
              name="otp"
              placeholder="Enter verification code"
              value={otp}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
        
        <p className="resend-link">
          Didn't receive the code?{" "}
          <button 
            onClick={handleResendOTP} 
            disabled={loading}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#2563eb', 
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit'
            }}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}

export default OTPVerificationPopup;