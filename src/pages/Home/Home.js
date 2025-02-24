import React, { useContext} from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import Cleaning from '../../assets/images/Cleaning.jpg';
import Repair from '../../assets/images/Handyman.jpg';
import Gardener from '../../assets/images/Gardener.jpg'; 
import Bill from '../../assets/images/bill.png';
import Expert from '../../assets/images/expert.png';
import Equipment from '../../assets/images/equipment.png'; 
import QA from '../../assets/images/QA.png'; 
import { AuthContext } from '../../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

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
          <div className="service-card">
            <img src={Cleaning} alt="Cleaning Services" />
            <h3>Cleaning</h3>
            <p>Professional cleaning services to keep your home spotless fresh.</p>
            <div className='services-btn-group'>
              <button onClick={() => navigate('/services/cleaning')} className="service-btn">Try now</button>
              
            </div>
          </div>
          <div className="service-card">
            <img src={Repair} alt="Repair Services" />
            <h3>Repairs</h3>
            <p>Reliable repair services for any household issues, ensuring everything works smoothly.</p>
            <div className='services-btn-group'>
              <button onClick={() => navigate('/services/repairs')} className="service-btn">Try now</button>
              
            </div>
          </div>
          <div className="service-card">
            <img src={Gardener} alt="Gardening Services" />
            <h3>Gardener</h3>
            <p>Create and maintain a beautiful garden with expert landscaping and gardening services.</p>
            <div className='services-btn-group'>
              <button onClick={() => navigate('/services/gardener')} className="service-btn">Try now</button>
              <button className="service-btn-alt">Learn more</button>
            </div>
          </div>
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