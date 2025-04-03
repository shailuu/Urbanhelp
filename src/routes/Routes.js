import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/Home/Home";
import Workwithus from "../pages/Workwithus/Workwithus";
import Services from "../pages/Services/Services";
import AboutUs from "../pages/AboutUs/AboutUs";
import ContactUs from "../pages/ContactUs/ContactUs";
import Profile from "../pages/Profile/Profile";
import Bookings from "../pages/Bookings/Bookings";
import Error from "../pages/Error/Error";
import ServiceDetail from "../pages/Services/ServiceDetail";

// Admin Panel
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UsersPage from "../pages/Admin/Users"; 
import Contacts from "../pages/Admin/Contacts"; 
import WorkWithUs from "../pages/Admin/WorkWithUs"; 
import Layout from "../Components/Admin/Layout";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:id" element={<Bookings />} />

        {/* Admin Panel Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <Layout>
                <Contacts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workwithus"
          element={
            <ProtectedRoute>
              <Layout>
                <WorkWithUs />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
