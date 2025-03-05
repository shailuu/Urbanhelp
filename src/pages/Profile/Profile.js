import React, { useState } from "react";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import "./Profile.css";

function Profile() {
  // Updated state: Replaced 'surname' with 'dob'
  const [formData, setFormData] = useState({
    firstName: "",
    dob: "", // Date of Birth
    gender: "",
    city: "",
    phoneNumber: "",
    address: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <Header />

      {/* Profile Content */}
      <div className="profile-container">
        <h1 className="welcome-text">Welcome, John Smith</h1>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img 
              src="/api/placeholder/48/48" 
              alt="Profile" 
              className="profile-image" 
            />
          </div>
          <div className="profile-info">
            <p className="profile-name">John Smith</p>
            <p className="profile-email">JohnSmith@gmail.com</p>
          </div>
          <button className="edit-button">Edit</button>
        </div>

        {/* Form Grid */}
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your name" 
              className="form-input" 
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="form-input" 
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select a city</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number" 
              className="form-input"
              pattern="[0-9]*" 
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address" 
              className="form-input"
            />
          </div>
        </div>

        {/* Email Section */}
        <div className="email-section">
          <h2>My Email Address</h2>
          <div className="email-entry">
            <div className="email-dot"></div>
            <div className="email-details">
              <p className="email-address">JohnSmith@gmail.com</p>
              <p className="email-time">1 month ago</p>
            </div>
          </div>
          <button className="add-email-button">+ Add Email Address</button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Profile;