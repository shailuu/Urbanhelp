import React from 'react';
import './ContactUs.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';

function ContactUs() {
  return (
    <div className='contact-us'>
      <Header />
      <div className="contact-container">
        <header>
          <h1><b>Contact Us</b></h1>
          <p>Please fill out the form below to get in touch with us. We look forward to hearing from you!</p>
        </header>
        <form>
          <div className="section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email address" />
            </div>
           
          </div>
          <div className="section">
            <h2>Message</h2>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Type your message here..."></textarea>
            </div>
          </div>
          <button className='contact-us-btn' type="submit">Send Message</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;