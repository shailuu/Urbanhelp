import React from "react";
import "./ServiceCard.css";

const ServiceCard = ({ title, description, image }) => {
  return (
    <div className="service-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="btn-rates">Find Rates</button>
    </div>
  );
};

export default ServiceCard;
