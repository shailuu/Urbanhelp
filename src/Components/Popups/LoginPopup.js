// Modified login popup implementation with improved password reset flow

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import OTPVerificationPopup from "./OTPVerificationPopup";

function LoginPopup({ onClose }) {
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [awaitingReset, setAwaitingReset] = useState(false); // after OTP verified
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useContext(AuthContext);
  const { email, password, otp } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    if (forgotPasswordMode && !awaitingReset) {
      // Step 1: Send OTP for password reset
      try {
        const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to send OTP");

        setSuccessMessage("OTP sent to your email. Please check your inbox.");
        setAwaitingReset(true); // Move directly to reset form
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (awaitingReset) {
      // Step 2: Reset password
      if (newPassword !== confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to reset password");

        setSuccessMessage("Password reset successful! You can now log in.");
        setTimeout(() => {
          setForgotPasswordMode(false);
          setAwaitingReset(false);
          setFormData({ email: "", password: "", otp: "" });
          setNewPassword("");
          setConfirmPassword("");
        }, 2000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal Login
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.requiresVerification) {
          setShowOTPVerification(true);
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      login({
        token: data.token,
        username: data.user.username,
        email: data.user.email,
        id: data.user.id,
        isAdmin: data.user.isAdmin,
      });

      onClose();
      navigate(data.user.isAdmin ? "/admin" : "/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <OTPVerificationPopup
        email={email}
        onVerified={(data) => {
          login({
            token: data.token,
            username: data.user.username,
            email: data.user.email,
            id: data.user.id,
            isAdmin: data.user.isAdmin,
          });
          onClose();
          navigate(data.user.isAdmin ? "/admin" : "/");
        }}
        onClose={() => {
          setShowOTPVerification(false);
        }}
      />
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>{forgotPasswordMode ? "Reset Password" : "Log In to Your Account"}</h1>
        <p>
          {forgotPasswordMode
            ? awaitingReset
              ? "Enter the OTP sent to your email and your new password."
              : "Enter your email to reset password."
            : "Welcome back!"}
        </p>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
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
              disabled={awaitingReset} // Disable changing email once OTP is sent
            />
          </div>

          {!forgotPasswordMode && (
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
          )}

          {awaitingReset && (
            <>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : forgotPasswordMode
                ? awaitingReset
                  ? "Reset Password"
                  : "Send OTP"
                : "Log In"}
            </button>
          </div>
        </form>

        {!forgotPasswordMode && (
          <p className="link-text" onClick={() => setForgotPasswordMode(true)}>
            Forgot Password?
          </p>
        )}

        {forgotPasswordMode && (
          <p className="link-text" onClick={() => {
            setForgotPasswordMode(false);
            setAwaitingReset(false);
            setError(null);
            setSuccessMessage("");
            setFormData({ email: "", password: "", otp: "" });
            setNewPassword("");
            setConfirmPassword("");
          }}>
            Back to Login
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPopup;