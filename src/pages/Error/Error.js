import React from "react";
import { Link } from "react-router-dom";
import "./Error.css";

const Error = () => {
  return (
    <div className="error">
      <h1>404</h1>
      <p>Oops! Something went wrong! Feel free to contact us for further assistance!</p>
      <div className="button-group">
        <Link to="/" className="home-link">Go to Home</Link>
        <Link to="/contactus" className="contact-link">Contact Us</Link>
      </div>
    </div>
  );
};

export default Error;
