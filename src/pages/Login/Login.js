import React from 'react';
import './Login.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

function Login() {
  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <h1>Login</h1>
        <p>Log in to manage your bookings.</p>
        <form className="login-form">
          <div className="input-group">
            <span class="input-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input type="email" placeholder="Your email address" required />
          </div>
          <div className="input-group">
            <span class="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input type="password" placeholder="Enter your password" required />
          </div>
          <div className="form-actions">
            <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
            <button type="submit" className="login-btn loginpage-login-btn">Login</button>
          </div>
        </form>
        <p>
          Need to create an account? <a href="/signup" className="signup-link">Sign up</a>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
