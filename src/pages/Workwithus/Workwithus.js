import React from 'react';
import './Workwithus.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';

function Workwithus() {
  return (
    <div className='work-with-us'>
      <Header />
      <div className="work-container">
          <h1>Apply to Work</h1>
          <p>Please fill the form below to receive a call from us. Feel free to add as much detail as needed.</p>
        <form>
          <div className="section">
            <h2>Contact details</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email address" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Provide your number" />
            </div>
           
          </div>
          <div className="section">
            <h2>Your qualifications</h2>
            <p>Please select which service you are interested in.</p>
            <select name="service" className="service-dropdown">
              <option value="" disabled selected>Select a service</option>
              <option value="plumbing">Plumbing</option>
              <option value="housemaid">House Maid</option>
              <option value="electrician">Electrician</option>
              <option value="gardener">Gardener</option>
              <option value="painter">Painter</option>
              <option value="handyman">Handyman</option>
            </select>
             </div> 
            <div className="form-group">
              <label htmlFor="skills">Skills and Qualifications</label>
              <textarea id="skills" placeholder="Type here..."></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="experience">Experience</label>
              <textarea id="experience" placeholder="Type here..."></textarea>
            </div>
  
          <button className='work-with-us-btn' type="submit">Submit Application</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Workwithus;
