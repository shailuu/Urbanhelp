import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import Logo from '../../assets/images/Logo.png'

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';


  return (
    <div className="header">
      <div className="header-logo" onClick={() => navigate('/')}>
      <img src={Logo} alt="Logo" />
        <span>UrbanHelp</span>
      </div>
      {!isLoginPage && !isSignupPage && (
      <div className="header-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>Services</NavLink>
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>
      </div>
      )}
      <div className="header-buttons">
        {!isLoginPage && (
          <button onClick={() => navigate('/login')} className="login-btn">Log In</button>
        )}
        {!isSignupPage && (
          <button onClick={() => navigate('/signup')} className="signup-btn">Sign Up</button>
        )}
      </div>
    </div>
  );
}

export default Header;
