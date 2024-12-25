import React from 'react';
import './Signup.css';
import Header from '../Shared/Header';
import buildingImage from '../../assets/images/assets.jpg';

function Signup() {
  return (
    <div className="signup-container">
      <Header />
      <div className="signup-content">
        {/* Image Section */}
        <div className="signup-image">
          <img src={buildingImage} alt="Building Logo" />
        </div>

        {/* Form Section */}
        <div className="signup-form">
          <h2>Signup</h2>
          <form>
            <label>
              Full Name:
              <input type="text" />
            </label>
            <label>
              Username:
              <input type="text" />
            </label>
            <label>
              Password:
              <input type="password" />
            </label>
            <label>
              Date of Birth:
              <input type="date" />
            </label>
            <button type="submit" className="signup-button">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
