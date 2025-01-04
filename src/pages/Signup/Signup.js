import React from 'react';
import './Signup.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
//import logo from '../../assets/images/logo.png'; 

function Signup() {
  return (
    <div className="signup-page">
      <Header />
      <div className="signup-container">
        <h1>Create Your Account</h1>
        <p>Use our services now!</p>
        <form className="signup-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input type="email" placeholder="Your email address" required />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input type="password" placeholder="Enter your password" required />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input type="password" placeholder="Confirm your password" required />
          </div>
          <div className="form-actions">
            <button type="submit" className="signup-btn signuppage-signup-btn">Sign Up</button>
          </div>
        </form>
        <p>
          Already have an account? <a href="/login" className="signup-link">Login</a>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
