import React, { useState } from 'react';
import './ContactUs.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';

function ContactUs() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
  
    if (!formData.username || !formData.email || !formData.message) {
      setResponseMessage("All fields are required.");
      return;
    }
  
    console.log("Sending data to backend:", formData);
  
    try {
      const response = await fetch("http://localhost:5001/api/form/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Response from backend:", data);
  
      if (response.ok) {
        setResponseMessage(data.message);
        setFormData({ username: '', email: '', message: '' });
      } else {
        setResponseMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An error occurred. Please try again later.");
    }
  };
  
  return (
    <div className='contact-us'>
      <Header />
      <div className="contact-container">
        <header>
          <h1><b>Contact Us</b></h1>
          <p>Please fill out the form below to get in touch with us. We look forward to hearing from you!</p>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label htmlFor="username">Name</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" required />
            </div>
          </div>
          <div className="section">
            <h2>Message</h2>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." required></textarea>
            </div>
          </div>
          <button className='contact-us-btn' type="submit">Send Message</button>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
