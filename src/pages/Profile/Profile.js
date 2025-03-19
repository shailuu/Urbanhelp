import React, { useState, useEffect } from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    dob: "",
    gender: "",
    city: "",
    phoneNumber: "",
    address: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const userData = await response.json();
        setFormData({
          firstName: userData.username || "",
          dob: userData.dob || "",
          gender: userData.gender || "",
          city: userData.city || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
          email: userData.email || "",
        });
      } catch (err) {
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data.");
      }
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode after saving
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    }
  };

  // Handle Add Email button click
  const handleAddEmail = () => {
    alert("This feature will be implemented soon!");
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <h1 className="welcome-text">Welcome, {formData.firstName}</h1>
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src="/api/placeholder/48/48"
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div className="profile-info">
            <p className="profile-name">{formData.firstName}</p>
            <p className="profile-email">{formData.email}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          {isEditing && (
            <button type="submit" className="save-button">
              Save Changes
            </button>
          )}
        </form>
        {/* Email Section */}
        <div className="email-section">
          <h2>My Email Address</h2>
          <div className="email-entry">
            <div className="email-dot"></div>
            <div className="email-details">
              <p className="email-address">{formData.email}</p>
              <p className="email-time">Added 1 month ago</p>
            </div>
          </div>
          <button className="add-email-button" onClick={handleAddEmail}>
            + Add Email Address
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;