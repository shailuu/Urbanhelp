import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import ServiceCard from '../Services/ServiceCard';
import Bill from '../../assets/images/bill.png';
import Expert from '../../assets/images/expert.png';
import Equipment from '../../assets/images/equipment.png';
import QA from '../../assets/images/QA.png';
import { AuthContext } from '../../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  // State to store the top 3 services
  const [topServices, setTopServices] = useState([]);

  // Fetch the top 3 services on component mount
  useEffect(() => {
    fetch("http://localhost:5001/api/services") // Fetch all services
      .then((response) => response.json())
      .then((data) => setTopServices(data.slice(0, 3))) // Limit to the first 3 items
      .catch((error) => console.error("Error fetching top services:", error));
  }, []);

  return (
    <div className="home-page">
      <Header />
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome {isAuthenticated ? user?.username || 'User' : 'to UrbanHelp'}</h1>
          <p>Your trusted partner for all home service needs.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/services')} className="explore-btn">Explore Services</button>
            <button onClick={() => navigate('/workwithus')} className="work-btn">Work with us</button>
          </div>
        </div>
      </div>

      <section className="services-section">
        <h2>Our Services</h2>
        <p>
          Explore a variety of household services tailored to make your life easier. From cleaning to repairs, UrbanHelp has you covered.
        </p>
        <div className="services-container">
          {/* Dynamically render the top 3 services */}
          {Array.isArray(topServices) && topServices.length > 0 ? (
            topServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))
          ) : (
            <p>No services available.</p>
          )}
        </div>
        <button onClick={() => navigate('/services')} className="more-services-btn">More Services</button>
      </section>

      <section className="why-urbanhelp-section">
        <div className="why-urban-help">
          <div className="why-left">
            <h2>Why Urban Help?</h2>
            <div className="feature">
              <img src={Bill} alt="Transparent Pricing" />
              <div>
                <h3>Transparent pricing</h3>
                <p>See fixed prices before you book. No hidden charges.</p>
              </div>
            </div>
            <div className="feature">
              <img src={Expert} alt="Experts" />
              <div>
                <h3>Experts only</h3>
                <p>Our professionals are well trained and have on-job expertise.</p>
              </div>
            </div>
            <div className="feature">
              <img src={Equipment} alt="Repair Services" />
              <div>
                <h3>Fully equipped</h3>
                <p>We bring everything needed to get the job done well.</p>
              </div>
            </div>
          </div>
          <div className="why-right">
            <div className="quality-box">
              <img src={QA} alt="Quality Assured" />
              <h3>100% Quality Assured</h3>
              <p>If you don’t love our service, we will make it right.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="booking-section">
        <h2><b>Book Your Service</b></h2>
        <p>Secure your appointment with top-rated providers for a seamless home service experience. Choose your preferred date and time now!</p>
        <button onClick={() => navigate('/services')}>Start Booking</button>
      </section>
      

      <Footer />
    </div>
  );
}

export default Home;