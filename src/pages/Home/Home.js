import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import Cleaning from '../../assets/images/Cleaning.jpg'
import Repair from '../../assets/images/Handyman.jpg'

function Home() {
  const navigate = useNavigate();

  return (
    
    <div className="home-page">
      <Header />
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to UrbanHelp</h1>
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
          <div className="service-card">
            <img src={Cleaning} alt="Cleaning Services" />
            <h3>Cleaning</h3>
            <p>Professional cleaning services to keep your home spotless fresh.</p>
            <div className='services-btn-group'>
              <button onClick={() => navigate('/services/cleaning')} className="service-btn">Try now</button>
              <button className="service-btn-alt">Learn more</button>
            </div>
          </div>
          <div className="service-card">
            <img src={Repair} alt="Repair Services" />
            <h3>Repairs</h3>
            <p>Reliable repair services for any household issues, ensuring everything works smoothly.</p>
            <div className='services-btn-group'>
              <button onClick={() => navigate('/services/repairs')} className="service-btn">Try now</button>
              <button className="service-btn-alt">Learn more</button>
            </div>

          </div>
        </div>
        <button onClick={() => navigate('/services')} className="more-services-btn">More Services</button>
      </section>

      <section className="testimonial-section">
        <div className="testimonial-card">
          <p>
            "UrbanHelp has been a lifesaver for me! The service is reliable and the staff is incredibly professional."
          </p>
          <span>— Smriti Shakya, Software Engineer</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
