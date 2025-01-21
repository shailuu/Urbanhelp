import React from 'react';
import './ServiceCard.css';

function ServiceCard({ title, description, image }) {
  return (
    <div className="service-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="learn-more-btn">Learn More</button>
    </div>
  );
}

export default ServiceCard;