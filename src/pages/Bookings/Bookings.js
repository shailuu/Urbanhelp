import React from "react";
import { useNavigate } from "react-router-dom";
import "./Bookings.css";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const Bookings = () => {
  const navigate = useNavigate();

    return (
      <div> {/* Added a wrapping div */}
            <Header /> {/* Render the Header component */}
        <div className="booking-container">
            <h2 className="title">Book your service now!</h2>
            <p className="subtitle">Please fill the form below!</p>

            <div className="form-wrapper">
                {/* Left Section - Contact Details */}
                <div className="contact-section">
                    <div className="progress-bar">
                        <div className="step active">1</div>
                        <div className="line"></div>
                        <div className="step">2</div>
                        <div className="line"></div>
                        <div className="step">3</div>
                        <div className="line"></div>
                        <div className="step">4</div>
                    </div>

                    <h3 className="section-title">Contact details</h3>
                    <p className="info-text">Please edit your info if necessary.</p>

                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="clientName">Client name</label>
                            <input type="text" id="clientName" placeholder="John Smith" />
                            <i className="fas fa-user"></i> {/* Example icon */}
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Email address" />
                            <i className="fas fa-envelope"></i> {/* Example icon */}
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" id="phone" placeholder="(123) 456 - 7890" />
                            <i className="fas fa-phone"></i> {/* Example icon */}
                        </div>
                        <div className="input-group">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" placeholder="Location" />
                            <i className="fas fa-map-marker-alt"></i> {/* Example icon */}
                        </div>
                    </div>

                    <button className="next-btn" onClick={() => navigate("/next-step")}>Next step</button>
                </div>

                {/* Right Section - Selected Service */}
                <div className="service-section">
                    <h3 className="section-title">Selected Service</h3>
                    <div className="service-card">
                        <img src="https://via.placeholder.com/100" alt="Cleaning Service" className="service-image" />
                        <div className="service-info">
                            <h4>House Maid</h4>
                            <p>Efficient cleaning services tailored to your home's needs, ensuring a spotless environment.</p>
                            <p className="price">Price: $120</p>
                            <p className="disclaimer">*Price may vary at the end*</p>
                        </div>
                    </div>
                    <button className="change-btn">Change</button>
                </div>
            </div>
        </div>
    );
    <Footer /> {/* Render the Footer component */}
        </div>
    );
};



export default Bookings;
