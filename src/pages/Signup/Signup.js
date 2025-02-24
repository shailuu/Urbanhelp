import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { username, email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      alert('User registered successfully!');
      navigate('/login'); // Redirect after successful registration
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Header />
      <div className="signup-container">
        <h1>Create Your Account</h1>
        <p>Use our services now!</p>
        {error && <p className="error-message">{error}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={username} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input 
              type="email" 
              name="email" 
              placeholder="Your email address" 
              value={email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="signup-btn signuppage-signup-btn" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
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