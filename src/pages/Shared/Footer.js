import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';
import Logo from '../../assets/images/logomain.png'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={Logo} alt="Logo" className="footer-logo" />
          <p>Copyright 2025 © All Rights Reserved</p>
          <p>Contact us: 9810486660</p>
          <p>Email Us: UrbanHelp@customerservice.np</p>
        </div>
        <div className="footer-right">
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>
        <NavLink to="/contactus" className={({ isActive }) => (isActive ? 'active' : '')}>Contact Us</NavLink>
        <NavLink to="/workwithus" className={({ isActive }) => (isActive ? 'active' : '')}>Work with Us</NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;