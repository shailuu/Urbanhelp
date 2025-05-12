import React, { useState, useEffect } from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // Importing the user icon
import { useNavigate } from "react-router-dom";

function Profile() {
  const [formData, setFormData] = useState({
    username: "",
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
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false); // State for success dialog
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
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
        // Format dob to YYYY-MM-DD if it exists
        let formattedDob = "";
        if (userData.dob) {
          const dobDate = new Date(userData.dob);
          formattedDob = dobDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
        }
        setFormData({
          username: userData.username || "", // Required field
          dob: formattedDob || "", // Optional field, ensure it's in YYYY-MM-DD format
          gender: userData.gender || "", // Optional field
          city: userData.city || "", // Optional field
          phoneNumber: userData.phoneNumber || "", // Optional field
          address: userData.address || "", // Optional field
          email: userData.email || "", // Required field
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
    if (!formData.username || !formData.email) {
      alert("Username and Email are required fields.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    // Create a copy without email (since it's not updatable)
    const dataToSend = { ...formData };
    delete dataToSend.email;
    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data.");
      }
      const result = await response.json();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000); // Hide success message after 3 seconds
      setIsEditing(false); // Exit edit mode after saving
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    }
  };

  // Handle profile completeness percentage
  const calculateProfileCompleteness = () => {
    const fields = ["username", "email", "dob", "gender", "city", "phoneNumber", "address"];
    const filledFields = fields.filter(field => formData[field] && formData[field].trim() !== "");
    return Math.round((filledFields.length / fields.length) * 100);
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete account.");
      }

      // Show success dialog
      setShowDeleteDialog(false); // Hide confirmation dialog
      setShowDeleteSuccessDialog(true);

      // Clear token and redirect after 3 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
      }, 3000);
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading your profile...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Login</button>
      </div>
    );
  }

  const completeness = calculateProfileCompleteness();

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <h1 className="welcome-text">Welcome, {formData.username}</h1>

        {/* Profile Completeness Indicator */}
        <div className="profile-completeness">
          <div className="completeness-bar">
            <div
              className="completeness-fill"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
          <p>Profile {completeness}% complete</p>
        </div>

        {updateSuccess && (
          <div className="success-message">
            Profile updated successfully!
          </div>
        )}

        <div className="profile-header">
          <div className="profile-image-container">
            {/* Replacing the image with a user icon */}
            <FontAwesomeIcon icon={faUser} className="user-icon" />
          </div>
          <div className="profile-info">
            <p className="profile-name">{formData.username}</p>
            <p className="profile-email">{formData.email}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
              required
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
    placeholder="Enter your 10-digit phone number"
    disabled={!isEditing}
    className="form-input"
    pattern="\d{10}"
    title="Phone number must be exactly 10 digits"
    maxLength={10}
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
              <p className="email-time">Primary Email</p>
            </div>
          </div>
        </div>

        {/* Delete Account Button */}
        <div className="delete-account-section">
          <button
            className="delete-button"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete My Account
          </button>

          {/* Confirmation Dialog */}
          {showDeleteDialog && (
            <div className="confirmation-dialog">
              <p>Are you sure you want to delete your account?</p>
              <div className="dialog-buttons">
                <button
                  className="confirm-button"
                  onClick={handleDeleteAccount}
                >
                  Yes, Proceed
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Success Dialog */}
          {showDeleteSuccessDialog && (
            <div className="success-dialog">
              <p>Your account has been deleted.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;