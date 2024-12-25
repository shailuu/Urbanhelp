import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import toolsImage from "../../assets/images/assets.jpg";
import icon1 from "../../assets/images/icon1.png"; // Replace with the correct path
import icon2 from "../../assets/images/icon2.png"; // Replace with the correct path
import icon3 from "../../assets/images/icon3.png"; // Replace with the correct path
import securityIcon from "../../assets/images/security.png"; // Replace with the correct path

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleHomePage = () => {
    navigate("/");
  };

  return (
    <div className="home-page">

      {/* Header Section */}
      <header className="header">
        <img
          src="/path-to-logo" // Replace with your logo
          alt="UrbanHelp Logo"
          className="logo"
          onClick={handleHomePage}
        />
        <h1>UrbanHelp</h1>
      </header>

      {/* Main Landing Section */}
      <section className="home-content">
        <div className="home-left">
          <h2>Whipping Up Home Help, One Click at a Time</h2>
          <p>
            Your go-to platform for finding trustworthy and skilled house help
            in Kathmandu. Simplify your life, hire with confidence, and enjoy a
            well-maintained home.
          </p>
          <button className="get-started" onClick={handleLogin}>
            Get Started
          </button>
        </div>
        <div className="home-right">
          <img src={toolsImage} alt="House Tools" />
        </div>
      </section>

      {/* Why Urban Company Section */}
      <div className="home-why-urban-container">
        <div className="home-why-urban-left">
          <h1>Why Urban Company?</h1>

          <div className="home-why-urban-feature">
            <img src={icon1} alt="Transparent Pricing" />
            <h3>Transparent pricing</h3>
            <p>See fixed prices before you book. No hidden charges.</p>
          </div>

          <div className="home-why-urban-feature">
            <img src={icon2} alt="Experts Only" />
            <h3>Experts only</h3>
            <p>Our professionals are well trained and have on-job expertise.</p>
          </div>

          <div className="home-why-urban-feature">
            <img src={icon3} alt="Fully Equipped" />
            <h3>Fully equipped</h3>
            <p>We bring everything needed to get the job done well.</p>
          </div>
        </div>

        <div className="home-why-urban-right">
          <div className="home-why-urban-quality-assured">
            <img src={securityIcon} alt="Security Icon" className="home-why-urban-security-icon" />
            <h2>100% Quality Assured</h2>
            <p>If you don’t love our service, we will make it right.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
