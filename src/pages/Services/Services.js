import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import "./Services.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Services() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/services") // Replace with your actual backend API
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="service-page">
      <Header />
      <div className="service-container">
        <div className="search-section">
          <h1>Service Selection</h1>
          <div className="search-group">
            <span className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="services-grid">
          {filteredServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
      <section className="booking-section">
        <h2><b>Book Your Service</b></h2>
        <p>Secure your appointment with top-rated providers for a seamless home service experience. Choose your preferred date and time now!</p>
        <button>Start Booking</button>
      </section>
      <Footer />
    </div>
  );
}

export default Services;
