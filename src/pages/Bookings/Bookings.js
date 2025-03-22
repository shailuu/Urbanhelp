import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Bookings.css";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Bookings = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const duration = searchParams.get("duration");
  const charge = searchParams.get("charge");

  // Access the logged-in user's profile from AuthContext
  const { isAuthenticated, user } = useContext(AuthContext);

  // State for form data
  const [formData, setFormData] = useState({
    clientName: user?.username || "", // Use user's username if available
    email: user?.email || "", // Use user's email if available
    phoneNumber: user?.phoneNumber || "", // Use user's phone number if available
    location: user?.city || "", // Use user's city as location if available
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00 PM");
  const [errors, setErrors] = useState({});
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch service details based on ID
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/services/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service details:", error);
        setLoading(false);
      });
  }, [id]);

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.clientName.trim()) {
        newErrors.clientName = "Name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      }
      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
      }
    }
    if (currentStep === 2 && !selectedDate) {
      newErrors.date = "Date is required";
    }
    if (currentStep === 2 && !selectedTime) {
      newErrors.time = "Time is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error for the specific field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setErrors((prevErrors) => ({
      ...prevErrors,
      date: "",
    }));
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setErrors((prevErrors) => ({
      ...prevErrors,
      time: "",
    }));
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const bookingData = {
        service: service,
        serviceId: id,
        duration: duration,
        charge: charge,
        date: selectedDate,
        time: selectedTime,
        clientInfo: formData,
      };
      console.log("Booking data:", bookingData);
      alert("Booking submitted successfully! This is a mock submission.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="booking-container">
          <div className="loading">Loading service details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Header />
        <div className="booking-container">
          <div className="loading">Failed to load service details. Please try again later.</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="booking-container">
        <h1 className="booking-title">Book your service now!</h1>
        <p className="booking-subtitle">Please fill the form below!</p>
        <div className="booking-content">
          <div className="booking-form-container">
            <div className="card">
              <div className="card-content">
                <div className="steps-container">
                  <div className="step-indicator">
                    <div className={`step ${currentStep === 1 ? "active" : ""}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep === 2 ? "active" : ""}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep === 3 ? "active" : ""}`}>3</div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep === 4 ? "active" : ""}`}>4</div>
                  </div>
                </div>
                {currentStep === 1 && (
                  <div className="form-section">
                    <h2>Contact details</h2>
                    <p className="form-subtitle">
                      These details are pre-filled from your profile. You can edit them if needed.
                    </p>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Client name</label>
                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          placeholder="John Smith"
                          className={errors.clientName ? "error" : ""}
                        />
                        {errors.clientName && (
                          <span className="error-message">{errors.clientName}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                          className={errors.email ? "error" : ""}
                        />
                        {errors.email && (
                          <span className="error-message">{errors.email}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="(123) 456 - 7890"
                          className={errors.phoneNumber ? "error" : ""}
                        />
                        {errors.phoneNumber && (
                          <span className="error-message">{errors.phoneNumber}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Location"
                          className={errors.location ? "error" : ""}
                        />
                        {errors.location && (
                          <span className="error-message">{errors.location}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="next-button"
                      onClick={handleNextStep}
                    >
                      Next step
                    </button>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="form-section">
                    <h2>Date & Time</h2>
                    <p className="form-subtitle">
                      Please select your preferred date and time.
                    </p>
                    <div className="date-time-container">
                      <div className="date-picker">
                        <label>Select Date</label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateSelection}
                          minDate={new Date()}
                          dateFormat="MMMM d, yyyy"
                          className={errors.date ? "error" : ""}
                          placeholderText="Select a date"
                        />
                        {errors.date && (
                          <span className="error-message">{errors.date}</span>
                        )}
                      </div>
                      <div className="time-picker">
                        <label>Select Time</label>
                        <select
                          value={selectedTime}
                          onChange={(e) => handleTimeSelection(e.target.value)}
                          className={errors.time ? "error" : ""}
                        >
                          <option value="">Select a time</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                        </select>
                        {errors.time && (
                          <span className="error-message">{errors.time}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-navigation">
                      <button
                        type="button"
                        className="previous-button"
                        onClick={handlePreviousStep}
                      >
                        Previous step
                      </button>
                      <button
                        type="button"
                        className="next-button"
                        onClick={handleSubmit}
                      >
                        Submit Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Updated Selected Service Section */}
          <div className="service-selection-container">
            <div className="service-selection-card">
              <h2 className="service-selection-header">Selected Service</h2>
              <div className="service-selection-info">
                <div className="service-selection-details">
                  <h3 className="service-selection-title">
                    {service ? service.title : "Loading..."}
                  </h3>
                  <p className="service-selection-description">
                    {service ? service.description : "Loading service details..."}
                  </p>
                  <div className="service-selection-metadata">
                    <p>
                      <strong>Duration:</strong> {duration}
                    </p>
                  </div>
                  <div className="service-selection-price">
                    <p>
                      <strong>Price:</strong> ${charge}
                    </p>
                    <p className="service-selection-note">*Price may vary at the spot</p>
                  </div>
                </div>
                <div className="service-selection-image">
                  {service && service.image ? (
                    <img src={service.image} alt={service.title} />
                  ) : (
                    <img
                      src="https://via.placeholder.com/120"
                      alt="Service Placeholder"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Bookings;