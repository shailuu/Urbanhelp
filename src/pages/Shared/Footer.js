import React from 'react';
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
            <p>Cleaning</p>
            <p>Repairs</p>
            <p>Others</p>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <p>Blog</p>
            <p>User Guides</p>
            <p>Offers</p>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <p>About us</p>
            <p>Contact us</p>
            <p>Work with us</p>
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
