import React, { useState } from "react";
import "./Workwithus.css";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";

function Workwithus() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    skills: "",
    experience: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to the backend API
      const response = await fetch("http://localhost:5001/api/form/workwithus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          skills: "",
          experience: "",
        });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="work-with-us">
      <Header />
      <div className="work-container">
        <h1>Apply to Work</h1>
        <p>Please fill the form below to receive a call from us. Feel free to add as much detail as needed.</p>
        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Contact details</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
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
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Provide your number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="section">
            <h2>Your qualifications</h2>
            <p>Please select which service you are interested in.</p>
            <select
              name="service"
              className="service-dropdown"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a service
              </option>
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
            <textarea
              id="skills"
              name="skills"
              placeholder="Type here..."
              value={formData.skills}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <textarea
              id="experience"
              name="experience"
              placeholder="Type here..."
              value={formData.experience}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button className="work-with-us-btn" type="submit">
            Submit Application
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Workwithus;