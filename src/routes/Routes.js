import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Workwithus from '../pages/Workwithus/Workwithus';
import Services from '../pages/Services/Services'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/workwithus" element={<Workwithus />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
