import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from "../../Components/Popups/LoginPopup";
import SignupPopup from "../../Components/Popups/SignupPopup";

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for managing popup visibility
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);

  // Functions to open and close popups
  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);
  const openSignupPopup = () => setIsSignupPopupOpen(true);
  const closeSignupPopup = () => setIsSignupPopupOpen(false);

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo" onClick={() => navigate("/")}>
        <span>UrbanHelp</span>
      </div>

      {/* Navigation Links */}
      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>
          Services
        </NavLink>
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? "active" : "")}>
          About Us
        </NavLink>
      </nav>

      {/* Header Buttons */}
      <div className="header-buttons">
        {isAuthenticated ? (
          <>
            <button 
              className="icon-btn notification-btn"
              onClick={() => navigate("/notifications")}
            >
              <FontAwesomeIcon icon={faBell} />
            </button>
            <button 
              className="icon-btn profile-btn" 
              onClick={() => navigate("/profile")}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{user?.username}</span>
            </button>
            <button 
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="logout-btn"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={openLoginPopup}>
              Log In
            </button>
            <button className="signup-btn" onClick={openSignupPopup}>
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Render the LoginPopup if isLoginPopupOpen is true */}
      {isLoginPopupOpen && <LoginPopup onClose={closeLoginPopup} />}

      {/* Render the SignupPopup if isSignupPopupOpen is true */}
      {isSignupPopupOpen && <SignupPopup onClose={closeSignupPopup} />}
    </header>
  );
}

export default Header;