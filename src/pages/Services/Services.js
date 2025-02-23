import React from "react";
import ServiceCard from "./ServiceCard";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import "./Services.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Plumbing from '../../assets/images/plumber.jpg';
import HouseMaid from '../../assets/images/Maid.jpg';
import Electrician from '../../assets/images/Electrician.jpg';
import Gardener from '../../assets/images/Gardener.jpg';
import Painter from '../../assets/images/painter.jpg';
import Handyman from '../../assets/images/Handyman.jpg';

function Services() {
  const services = [
    { title: "Plumbing", description: "Expert solutions for all your water-related needs, from leaks to installations.", image: Plumbing },
    { title: "House Maid", description: "Efficient cleaning services tailored to your home’s needs, ensuring a spotless environment.", image: HouseMaid },
    { title: "Electrician", description: "Reliable electrical services to keep your home or office powered and safe.", image: Electrician },
    { title: "Gardener", description: "Create and maintain a beautiful garden with expert landscaping and gardening services.", image: Gardener },
    { title: "Painter", description: "Professional painting services to transform your space with fresh, vibrant colors.", image: Painter },
    { title: "Handyman", description: "Skilled professionals to take care of any household repair or maintenance task, big or small.", image: Handyman },
  ];

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
          <input type="text" placeholder="Search" required />
        </div>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
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