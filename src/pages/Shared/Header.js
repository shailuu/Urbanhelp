import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// Import the popups
import SignupPopup from '../../Components/Popups/SignupPopup';
import LoginPopup from '../../Components/Popups/LoginPopup';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for controlling the popups
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  // Handlers for opening popups
  const openSignup = () => setSignupOpen(true);
  const openLogin = () => setLoginOpen(true);

  // Handlers for closing popups
  const closeSignup = () => setSignupOpen(false);
  const closeLogin = () => setLoginOpen(false);

  return (
    <div className="header">
      <div className="header-logo" onClick={() => navigate('/')}>
        <span>UrbanHelp</span>
      </div>

      <div className="header-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>Services</NavLink>
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>
      </div>

      <div className="header-buttons">
        {isAuthenticated ? (
          <>
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <FontAwesomeIcon icon={faBell} />
            </button>
            <button className="icon-btn" onClick={() => navigate('/profile')}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={openLogin} className="login-btn">Log In</button>
            <button onClick={openSignup} className="signup-btn">Sign Up</button>
          </>
        )}
      </div>

      {/* Render Signup and Login popups */}
      {isSignupOpen && <SignupPopup onClose={closeSignup} />}
      {isLoginOpen && <LoginPopup onClose={closeLogin} />}
    </div>
  );
}

export default Header;
