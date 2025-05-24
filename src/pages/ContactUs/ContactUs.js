import React, { useState } from 'react';
import './ContactUs.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [status, setStatus] = useState(null); // For displaying submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill in all required fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/api/form/contact', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setStatus('Your message has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setStatus(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('Error sending message. Please try again later.');
    }
  };
  

  return (
    <div className="contact-us">
      <Header />
      <div className="contact-container">
        <h1><b>Contact Us</b></h1>
        <p>Please fill out the form below to get in touch with us. We look forward to hearing from you!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(123) 456 - 7890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="section">
            <h2>Message</h2>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <button className="contact-us-btn" type="submit">Send Message</button>
        </form>

        {status && <p className="status-message">{status}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
