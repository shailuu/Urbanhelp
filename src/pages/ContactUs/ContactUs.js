import React from 'react';
import './ContactUs.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';

function ContactUs() {
  return (
    <div className='contact-us'>
      <Header />
      <div className="container">
        <header>
          <h1>Contact Us</h1>
          <p>Please fill out the form below to get in touch with us. We look forward to hearing from you!</p>
        </header>
        <form>
          <div className="section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email address" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="(123) 456 - 7890" />
            </div>
          </div>
          <div className="section">
            <h2>Message</h2>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="Subject" />
            </div>
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