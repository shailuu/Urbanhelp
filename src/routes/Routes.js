import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Workwithus from "../pages/Workwithus/Workwithus";
import Services from "../pages/Services/Services";
import AboutUs from "../pages/AboutUs/AboutUs";
import ContactUs from "../pages/ContactUs/ContactUs";
import Profile from "../pages/Profile/Profile";
import Bookings from "../pages/Bookings/Bookings";
import Error from "../pages/Error/Error";
import ServiceDetail from "../pages/Services/ServiceDetail";


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/workwithus" element={<Workwithus />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/services/:id" element={<ServiceDetail />} />

        {/* Protected Routes (Require Authentication) */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:id" element={<Bookings />} />

        {/* Catch-all Route for 404 Errors */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;