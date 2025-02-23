import React, { useState } from "react";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import "./Profile.css";

function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    gender: "Male",
    city: "",
    phoneNumber: "",
    address: "GMT"
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
      <Header />
      <div className="profile-container">
        <h1 className="welcome-text">Welcome, John Smith</h1>
        <p className="date">Feb 07 2024 2022</p>
        
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

        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name" 
              className="form-input" 
            />
          </div>
          
          <div className="form-group">
            <label>Surname</label>
            <input 
              type="text" 
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              placeholder="Enter your surname" 
              className="form-input" 
            />
          </div>
          
          <div className="form-group">
            <label>Gender</label>
            <div className="select-wrapper">
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>City</label>
            <div className="select-wrapper">
              <select 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select a city</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="lalitpur">Lalitpur</option>
                <option value="bhaktapur">Bhaktapur</option>
              </select>
            </div>
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
            <div className="select-wrapper">
              <select 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="GMT">GMT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="email-section">
          <h2>My email Address</h2>
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
      <Footer />
    </div>
  );
}

export default Profile;