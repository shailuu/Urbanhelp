import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import "./ServiceDetail.css";
import { AuthContext } from "../../context/AuthContext";
import LoginPopup from "../../Components/Popups/LoginPopup";

function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [service, setService] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [charge, setCharge] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loginReason, setLoginReason] = useState("");
    const [hasReviewed, setHasReviewed] = useState(false); // Track if user has reviewed

    useEffect(() => {
        fetch(`http://localhost:5001/api/services/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch service details");
                return res.json();
            })
            .then((data) => {
                setService(data);
                setLoading(false);
            })
            .catch(() => {
                alert("Failed to load service details. Please try again.");
                setLoading(false);
            });

        fetchReviews();

        if (isAuthenticated) {
            checkUserReview();
        }
    }, [id, isAuthenticated]);

    const fetchReviews = () => {
        fetch(`http://localhost:5001/api/services/${id}/reviews`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch reviews");
                return res.json();
            })
            .then((data) => setReviews(data))
            .catch((err) => console.error("Error loading reviews:", err));
    };

    const checkUserReview = async () => {
        const token = localStorage.getItem("token");
        if (!token || !isAuthenticated) return;

        try {
            const res = await fetch(`http://localhost:5001/api/services/${id}/check-review`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setHasReviewed(data.hasReviewed);
            }
        } catch (err) {
            console.error("Error checking review:", err);
        }
    };

    const handleDurationChange = (e) => {
        const selected = e.target.value;
        setSelectedDuration(selected);
        const option = service.durations.find((d) => d.duration === selected);
        setCharge(option ? option.charge : 0);
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
        setNewReview({
            ...newReview,
            [name]: name === "rating" ? parseInt(value) : value
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setLoginReason("review");
            setShowLoginPopup(true);
            return;
        }

        if (!newReview.comment.trim()) {
            alert("Please enter a comment.");
            return;
        }

        setSubmitLoading(true);

        const token = localStorage.getItem("token");

        fetch(`http://localhost:5001/api/services/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newReview)
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to submit review");
                return res.json();
            })
            .then(() => {
                setNewReview({ rating: 5, comment: "" });
                fetchReviews();
                setHasReviewed(true); // Mark as reviewed
                alert("Review submitted!");
            })
            .catch(() => alert("Review Already submitted"))
            .finally(() => setSubmitLoading(false));
    };

    const handleCloseLoginPopup = () => {
        setShowLoginPopup(false);
    };

    const handleLoginSuccess = () => {
        setShowLoginPopup(false);
        if (loginReason === "review") {
            setTimeout(() => {
                const textarea = document.querySelector(".comment-input textarea");
                if (textarea) textarea.focus();
            }, 300);
            checkUserReview(); // Refresh review status
        } else if (loginReason === "booking") {
            navigate(`/booking/${id}?duration=${selectedDuration}&charge=${charge}`);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
        ));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!service) return <div className="error-message">Service not found</div>;

    return (
        <div className="service-detail-page">
            <Header />
            <div className="service-detail-container">
                <div className="content-wrapper">
                    <div className="image-column">
                        <img src={service.image} alt={service.title} className="service-image" />
                    </div>
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
                                {service.durations.map((option, idx) => (
                                    <option key={idx} value={option.duration}>{option.duration}</option>
                                ))}
                            </select>
                        </div>
                        {charge > 0 && <p className="charge"><strong>Charge:</strong> Rs.{charge}</p>}
                        {charge > 0 && (
                            <button className="book-now-btn" onClick={handleBookNow}>Book Now</button>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2 className="reviews-title">Customer Reviews</h2>
                    <div className="reviews-container">
                        <div className="reviews-form-column">
                            {isAuthenticated ? (
                                hasReviewed ? (
                                    <p className="already-reviewed">
                                        You have already submitted your review.
                                    </p>
                                ) : (
                                    <form className="review-form" onSubmit={handleSubmitReview}>
                                        <h3>Write a Review</h3>
                                        <div className="rating-select">
                                            <label htmlFor="rating">Your Rating:</label>
                                            <select id="rating" name="rating" value={newReview.rating} onChange={handleReviewChange}>
                                                {[5, 4, 3, 2, 1].map((val) => (
                                                    <option key={val} value={val}>
                                                        {val} Star{val > 1 && 's'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="comment-input">
                                            <label htmlFor="comment">Your Review:</label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                value={newReview.comment}
                                                onChange={handleReviewChange}
                                                placeholder="Share your experience..."
                                                required
                                            />
                                        </div>
                                        <button
                                            className="submit-review-btn"
                                            type="submit"
                                            disabled={submitLoading}
                                        >
                                            {submitLoading ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </form>
                                )
                            ) : (
                                <div className="login-to-review">
                                    <p>
                                        Please{" "}
                                        <button
                                            className="login-link"
                                            onClick={() => {
                                                setLoginReason("review");
                                                setShowLoginPopup(true);
                                            }}
                                        >
                                            login
                                        </button>{" "}
                                        to share your experience
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="reviews-list-column">
                            <div className="reviews-list">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review._id} className="review-item">
                                            <div className="review-header">
                                                <span className="review-author">
                                                    {review.userId?.username || "Anonymous"}
                                                </span>
                                                <span className="review-date">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="review-rating">{renderStars(review.rating)}</div>
                                            <p className="review-comment">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-reviews">No reviews yet. Be the first to review this service!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Popup */}
                {showLoginPopup && (
                    <LoginPopup onClose={handleCloseLoginPopup} onLoginSuccess={handleLoginSuccess} />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ServiceDetail;