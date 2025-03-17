import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import "./ServiceDetail.css";

function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [charge, setCharge] = useState(0);

    // Simulating a login check (Replace with actual login check)
    const isLoggedIn = localStorage.getItem("userToken"); // Example check

    useEffect(() => {
        fetch(`http://localhost:5001/api/services/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setService(data))
            .catch(() => alert("Failed to load service details. Please try again."));
    }, [id]);

    const handleDurationChange = (e) => {
        const selected = e.target.value;
        setSelectedDuration(selected);
        const selectedOption = service.durations.find((d) => d.duration === selected);
        setCharge(selectedOption ? selectedOption.charge : 0);
    };

    const handleBookNow = () => {
        if (!isLoggedIn) {
            alert("Please log in to proceed with the booking.");
            return;
        }
        navigate(`/booking/${id}?duration=${selectedDuration}&charge=${charge}`);
    };

    if (!service) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="service-detail-page">
            <Header />
            <div className="service-detail-container">
                <h1 className="title">{service.title}</h1>
                <img className="service-image" src={service.image} alt={service.title} />
                <p className="description">{service.description}</p>
                {service.additionalDetails && (
                    <p className="additional-details">
                        <strong>Additional Details:</strong> {service.additionalDetails}
                    </p>
                )}
                <div className="dropdown-container">
                    <label htmlFor="duration">Select Duration:</label>
                    <select id="duration" value={selectedDuration} onChange={handleDurationChange}>
                        <option value="">--Choose Duration--</option>
                        {service.durations.map((option, index) => (
                            <option key={index} value={option.duration}>
                                {option.duration}
                            </option>
                        ))}
                    </select>
                </div>
                {charge > 0 && (
                    <p className="charge">
                        <strong>Charge:</strong> ${charge}
                    </p>
                )}

                {/* Book Now Button */}
                {charge > 0 && (
                    <button className="book-now-btn" onClick={handleBookNow}>Book Now</button>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ServiceDetail;
