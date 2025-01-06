import React from 'react';
import './Workwithus.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';

function Workwithus() {
  return (
    <div className='work-with-us'>
      <Header />
      <div className="container">
        <header>
          <h1>Apply to Work</h1>
          <p>Please fill the form below to receive a call from us. Feel free to add as much detail as needed.</p>
        </header>
        <form>
          <div className="section">
            <h2>Contact details</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="John Carter" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email address" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="(123) 456 - 7890" />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" placeholder="Company name" />
            </div>
          </div>
          <div className="section">
            <h2>Your qualifications</h2>
            <p>Please select which service you are interested in.</p>
            <div className="qualifications">
              <label><input type="radio" name="service" value="plumbing" /> Plumbing</label>
              <label><input type="radio" name="service" value="housemaid" /> House Maid</label>
              <label><input type="radio" name="service" value="electrician" /> Electrician</label>
              <label><input type="radio" name="service" value="gardener" /> Gardener</label>
              <label><input type="radio" name="service" value="painter" /> Painter</label>
              <label><input type="radio" name="service" value="handyman" /> Handyman</label>
            </div>
            <div className="form-group">
              <label htmlFor="skills">Skills and Qualifications</label>
              <textarea id="skills" placeholder="Type here..."></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="experience">Experience</label>
              <textarea id="experience" placeholder="Type here..."></textarea>
            </div>
          </div>
          <button className='work-with-us-btn' type="submit">Submit Application</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Workwithus;
