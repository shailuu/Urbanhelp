import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../context/AuthContext"; // Adjust path as needed

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
import BookingHistory from "../pages/BookingHistory/BookingHistory";
import PaymentStatusPage from "../Components/Popups/PaymentStatusPage"; 
//import Notifications from "../Components/Notifications";

// Admin Panel
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UsersPage from "../pages/Admin/Users"; 
import Contacts from "../pages/Admin/Contacts"; 
import WorkWithUs from "../pages/Admin/WorkWithUs"; 
import Layout from "../Components/Admin/Layout";
import AdminServices from "../pages/Admin/Services";
import ApprovedWorkers from "../pages/Admin/ApprovedWorkers"; 
import Reviews from "../pages/Admin/Reviews"; 
import PendingBookings from "../pages/Admin/Bookings"; // Previously Bookings.js
import ApprovedBookings from "../pages/Admin/ApprovedBookings";
// Redirect component based on user role
const RoleBasedRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  
  // If user is admin, redirect to admin dashboard
  if (user && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  
  // For regular users, redirect to home
  return <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Redirections */}
        <Route path="/redirect" element={<RoleBasedRedirect />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/workwithus" element={<Workwithus />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-status" element={<PaymentStatusPage />} />
        <Route path="/booking/:id" element={<Bookings />} />
        <Route path="/booking-history"
  element={
    <ProtectedRoute>
      <BookingHistory />
    </ProtectedRoute>
  }
/>


        {/* <Route path="/notifications" element={<Notifications />} /> */}

        {/* Admin Panel Routes - Protected with admin role check */}
        <Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <Layout>
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Contacts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workwithus"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <WorkWithUs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <AdminServices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvedworkers"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <ApprovedWorkers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/bookings"
  element={
    <ProtectedRoute adminOnly={true}>
      <Layout>
        <PendingBookings />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/approvedbookings"
  element={
    <ProtectedRoute adminOnly={true}>
      <Layout>
        <ApprovedBookings />
      </Layout>
    </ProtectedRoute>
  }
/>

        <Route
  path="/admin/reviews"
  element={
    <ProtectedRoute adminOnly={true}>
      <Layout>
        <Reviews />
      </Layout>
    </ProtectedRoute>
  }
/>

        {/* 404 Page */}
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;