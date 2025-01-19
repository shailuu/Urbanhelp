import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          {/* <img src={logo} alt="UrbanHelp Logo" /> */}
          <h3>UrbanHelp</h3>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Services</h4>
            <NavLink to="/services">Cleaning</NavLink>
            <NavLink to="/services">Repairs</NavLink>
            <NavLink to="/services">Others</NavLink>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/user-guides">User Guides</NavLink>
            <NavLink to="/offers">Offers</NavLink>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <NavLink to="/aboutus">About us</NavLink>
            <NavLink to="/contactus">Contact us</NavLink>
            <NavLink to="/workwithus">Work with us</NavLink>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© UrbanHelp | Privacy | Terms | Sitemap</p>
        <div className="footer-social">
          <i className="fab fa-twitter"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-youtube"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;