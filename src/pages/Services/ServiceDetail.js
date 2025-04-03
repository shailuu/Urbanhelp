import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import "./ServiceDetail.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoginPopup from "../../Components/Popups/LoginPopup";

function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
    const [service, setService] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [charge, setCharge] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loginReason, setLoginReason] = useState("");

    useEffect(() => {
        // Fetch service details
        fetch(`http://localhost:5001/api/services/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setService(data);
                setLoading(false);
            })
            .catch(() => {
                alert("Failed to load service details. Please try again.");
                setLoading(false);
            });

        // Fetch reviews for this service
        fetchReviews();
    }, [id]);

    const fetchReviews = () => {
        fetch(`http://localhost:5001/api/services/${id}/reviews`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setReviews(data);
            })
            .catch((error) => {
                console.error("Failed to load reviews:", error);
            });
    };

    const handleDurationChange = (e) => {
        const selected = e.target.value;
        setSelectedDuration(selected);
        const selectedOption = service.durations.find((d) => d.duration === selected);
        setCharge(selectedOption ? selectedOption.charge : 0);
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            setLoginReason("booking");
            setShowLoginPopup(true);
            return;
        }
        navigate(`/booking/${id}?duration=${selectedDuration}&charge=${charge}`);
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: name === "rating" ? parseInt(value) : value });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setLoginReason("review");
            setShowLoginPopup(true);
            return;
        }

        if (!newReview.comment.trim()) {
            alert("Please enter a comment for your review.");
            return;
        }

        setSubmitLoading(true);

        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem("token");

        fetch(`http://localhost:5001/api/services/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                rating: newReview.rating,
                comment: newReview.comment
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            // Reset form and refresh reviews
            setNewReview({ rating: 5, comment: "" });
            fetchReviews();
            alert("Review submitted successfully!");
        })
        .catch((error) => {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    };

    // Function to handle login popup close
    const handleCloseLoginPopup = () => {
        setShowLoginPopup(false);
    };

    // Function to handle successful login
    const handleLoginSuccess = () => {
        setShowLoginPopup(false);
        // If the user logged in to submit a review, focus the comment textarea
        if (loginReason === "review") {
            setTimeout(() => {
                const textarea = document.querySelector('.comment-input textarea');
                if (textarea) textarea.focus();
            }, 300);
        }
        // If they logged in to book, proceed with booking
        else if (loginReason === "booking") {
            navigate(`/booking/${id}?duration=${selectedDuration}&charge=${charge}`);
        }
    };

    // Function to render stars based on rating
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
        ));
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!service) {
        return <div className="error-message">Service not found</div>;
    }

    return (
        <div className="service-detail-page">
            <Header />
            <div className="service-detail-container">
                <div className="content-wrapper">
                    {/* Image Column */}
                    <div className="image-column">
                        <img className="service-image" src={service.image} alt={service.title} />
                    </div>

                    {/* Text Column */}
                    <div className="text-column">
                        <h1 className="title">{service.title}</h1>
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
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2 className="reviews-title">Customer Reviews</h2>
                    
                    {/* Submit Review Form */}
                    {isAuthenticated ? (
                        <form className="review-form" onSubmit={handleSubmitReview}>
                            <h3>Write a Review</h3>
                            <div className="rating-select">
                                <label>Rating:</label>
                                <select 
                                    name="rating" 
                                    value={newReview.rating} 
                                    onChange={handleReviewChange}
                                >
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>
                            <div className="comment-input">
                                <label>Comment:</label>
                                <textarea 
                                    name="comment" 
                                    value={newReview.comment} 
                                    onChange={handleReviewChange} 
                                    placeholder="Share your experience with this service..."
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="submit-review-btn" 
                                disabled={submitLoading}
                            >
                                {submitLoading ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    ) : (
                        <div className="login-to-review">
                            <p>Please <button className="login-link" onClick={() => {
                                setLoginReason("review");
                                setShowLoginPopup(true);
                            }}>Login to submit a review</button> </p>
                        </div>
                    )}

                    {/* Display Reviews */}
                    <div className="reviews-list">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="review-item">
                                    <div className="review-header">
                                        <span className="review-author">{review.userId?.username || "Anonymous"}</span>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="review-rating">
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews">No reviews yet. Be the first to review this service!</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Login Popup */}
            {showLoginPopup && (
                <LoginPopup 
                    onClose={handleCloseLoginPopup}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
            
            <Footer />
        </div>
    );
}

export default ServiceDetail;