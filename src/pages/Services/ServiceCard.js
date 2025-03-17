import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to create a route link
import "./ServiceCard.css";
function ServiceCard({ _id, title, description, image }) {
  return (
    <div className="service-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={`/services/${_id}`} className="learn-more-btn">
        Learn More
      </Link>
    </div>
  );
}

export default ServiceCard;
