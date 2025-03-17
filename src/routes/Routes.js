import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
// import Login from '../pages/Login/Login';
// import Signup from '../pages/Signup/Signup';
import Workwithus from '../pages/Workwithus/Workwithus';
import Services from '../pages/Services/Services'
import AboutUs from '../pages/AboutUs/AboutUs';
import ContactUs from '../pages/ContactUs/ContactUs';
import Profile from '../pages/Profile/Profile';
import Bookings from '../pages/Bookings/Bookings';
import Error from '../pages/Error/Error';
import ServiceDetail from '../pages/Services/ServiceDetail';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/workwithus" element={<Workwithus />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/booking' element={<Bookings/>} />
        <Route path ="*" element= {<Error/>} /> 
        <Route path="/services/:id" element={<ServiceDetail />} /> 
      </Routes>
    </Router>
  );
}

export default AppRoutes;
