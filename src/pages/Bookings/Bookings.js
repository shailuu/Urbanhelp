import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Import the default CSS
import "./Bookings.css";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const MOCK_SERVICE = {
    id: 1,
    name: "House Maid",
    description: "Efficient cleaning services tailored to your home's needs ensuring a spotless environment.",
    price: 150,
    image: "/api/placeholder/120/120"
};

const Bookings = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        email: '',
        phoneNumber: '',
        location: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null); // State for selected date
    const [selectedTime, setSelectedTime] = useState('12:00 PM');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.clientName.trim()) {
                newErrors.clientName = 'Name is required';
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }

            if (!formData.phoneNumber.trim()) {
                newErrors.phoneNumber = 'Phone number is required';
            }

            if (!formData.location.trim()) {
                newErrors.location = 'Location is required';
            }
        }

        if (currentStep === 2 && !selectedDate) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        if (errors.date) {
            setErrors(prev => ({
                ...prev,
                date: ''
            }));
        }
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
    };

    const handleNextStep = () => {
        if (validateForm()) {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep === 2 && validateForm()) {
            alert('Booking submitted successfully! This is a mock submission');
            console.log('Form data:', formData);
            console.log('Selected Date:', selectedDate);
            console.log('Selected Time:', selectedTime);
        }
    };

    const steps = [
        { number: 1, label: 'Contact' },
        { number: 2, label: 'Schedule' },
        { number: 3, label: 'Services' },
        { number: 4, label: 'Confirm' }
    ];

    return (
        <>
            <Header />
            <div className="booking-container">
                <h1 className="booking-title">Book your service now!</h1>
                <p className="booking-subtitle">Please fill the form below!</p>

                <div className="booking-content">
                    <div className="booking-form-container">
                        <div className="card">
                            <div className="card-content">
                                <div className="progress-bar">
                                    {steps.map((step, index) => (
                                        <React.Fragment key={step.number}>
                                            <div className={`step ${currentStep >= step.number ? 'active' : ''}`}>
                                                {step.number}
                                            </div>
                                            {index < steps.length - 1 && <div className="step-line" />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {currentStep === 1 && (
                                        <div className="form-section">
                                            <h2>Contact details</h2>
                                            <p className="form-subtitle">Please edit your info if necessary.</p>

                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Client name</label>
                                                    <input
                                                        type="text"
                                                        name="clientName"
                                                        value={formData.clientName}
                                                        onChange={handleInputChange}
                                                        placeholder="John Smith"
                                                        className={errors.clientName ? 'error' : ''}
                                                    />
                                                    {errors.clientName && <span className="error-message">{errors.clientName}</span>}
                                                </div>

                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="Email address"
                                                        className={errors.email ? 'error' : ''}
                                                    />
                                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                                </div>

                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="(123) 456 - 7890"
                                                        className={errors.phoneNumber ? 'error' : ''}
                                                    />
                                                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                                                </div>

                                                <div className="form-group">
                                                    <label>Location</label>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        placeholder="Location"
                                                        className={errors.location ? 'error' : ''}
                                                    />
                                                    {errors.location && <span className="error-message">{errors.location}</span>}
                                                </div>
                                            </div>

                                            <button type="button" className="next-button" onClick={handleNextStep}>
                                                Next step
                                            </button>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="form-section">
                                            <h2>Date & Time</h2>
                                            <p className="form-subtitle">Please select your preferred date and time.</p>

                                            <div className="date-picker">
                                                <label>Select Date</label>
                                                <DatePicker
                                                    selected={selectedDate}
                                                    onChange={handleDateSelection}
                                                    minDate={new Date()}
                                                    dateFormat="MMMM d, yyyy"
                                                    className={errors.date ? 'error' : ''}
                                                    placeholderText="Select a date"
                                                />
                                                {errors.date && <span className="error-message">{errors.date}</span>}
                                            </div>

                                            <div className="time-picker">
                                                <label>Select Time</label>
                                                <select value={selectedTime} onChange={(e) => handleTimeSelection(e.target.value)}>
                                                    <option value="12:00 PM">12:00 PM</option>
                                                    <option value="1:00 PM">1:00 PM</option>
                                                    <option value="2:00 PM">2:00 PM</option>
                                                    {/* Add more time options as needed */}
                                                </select>
                                            </div>

                                            <div className="form-navigation">
                                                <button type="button" className="previous-button" onClick={handlePreviousStep}>
                                                    Previous step
                                                </button>
                                                <button type="submit" className="next-button">
                                                    Submit Booking
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="service-details">
                        <div className="card">
                            <div className="card-content">
                                <h2>Selected Service</h2>
                                <div className="service-card">
                                    <div className="service-info">
                                        <h3>{MOCK_SERVICE.name}</h3>
                                        <p>{MOCK_SERVICE.description}</p>
                                        <div className="price-info">
                                            <p>Price: ${MOCK_SERVICE.price}</p>
                                            <p className="price-note">*Price may vary at the spot*</p>
                                        </div>
                                    </div>
                                    <div className="service-image">
                                        <img src={MOCK_SERVICE.image} alt="House Maid Service" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Bookings;