import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faSignOutAlt, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import LoginPopup from "../../Components/Popups/LoginPopup";
import SignupPopup from "../../Components/Popups/SignupPopup";
import Notifications from "../../Components/Notifications";

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);
  const openSignupPopup = () => setIsSignupPopupOpen(true);
  const closeSignupPopup = () => setIsSignupPopupOpen(false);

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/")}>
        <span>UrbanHelp</span>
      </div>

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

        {/* Show Booking History link only if logged in */}
        {isAuthenticated && (
          <NavLink to="/booking-history" className={({ isActive }) => (isActive ? "active" : "")}>
            <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: "6px" }} />
            History
          </NavLink>
        )}
      </nav>

      <div className="header-buttons">
        {isAuthenticated ? (
          <>
            <Notifications userEmail={user?.email} />

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

      {isLoginPopupOpen && <LoginPopup onClose={closeLoginPopup} />}
      {isSignupPopupOpen && <SignupPopup onClose={closeSignupPopup} />}
    </header>
  );
}

export default Header;
