import React from 'react';
import './AboutUs.css';
import Footer from '../Shared/Footer';
import Header from '../Shared/Header';
import Housefixing from '../../assets/images/Housefixing.png'

function AboutUs() {
  return (
    <div className="about-us-page">
      <Header />
      <div className="container">
        <div className="content">
          <div className="text-content">
            <h1>About Us</h1>
            <h2>Your trusted partner for all home service needs.</h2>
            <p>
              Welcome to Urban Help, a platform designed to simplify your life by making household chores effortless. At Urban Help, we connect you with trusted and skilled professionals to handle your home tasks, whether it’s plumbing, electrical work, housekeeping, gardening, painting, or handyman services.
            </p>
            <p>
              Our mission is to bring convenience and reliability to your doorstep, helping you find the right help quickly and easily. We carefully vet our professionals to ensure top-quality service, giving you peace of mind and more time to focus on the things you love.
            </p>
            <button className="learn-more-btn">Book Now</button>
          </div>
          <div className="image-content">
    <img src={Housefixing} alt="Housefixing" className="about-us-image" />
</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
