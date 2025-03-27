import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';  // Changed to relative import

// Public pages
import Home from '../pages/Home/Home';
import Workwithus from '../pages/Workwithus/Workwithus';
import Services from '../pages/Services/Services';
import AboutUs from '../pages/AboutUs/AboutUs';
import ContactUs from '../pages/ContactUs/ContactUs';
import Profile from '../pages/Profile/Profile';
import Bookings from '../pages/Bookings/Bookings';
import Error from '../pages/Error/Error';
import ServiceDetail from '../pages/Services/ServiceDetail';

// Admin components
import AdminLayout from '../Components/admin/AdminLayout/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import Users from '../pages/Admin/Users/Users';
import UserForm from '../pages/Admin/Users/UserForm';
import ServicesAdmin from '../pages/Admin/Services/Services';
import ServiceForm from '../pages/Admin/Services/ServiceForm';
import BookingsAdmin from '../pages/Admin/Bookings/Bookings';
import BookingDetails from '../pages/Admin/Bookings/BookingDetails';
import Applications from '../pages/Admin/Applications/Applications';
import ApplicationDetails from '../pages/Admin/Applications/ApplicationDetails';

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

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<ProtectedRoute isAdminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id" element={<UserForm />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/:id" element={<ServiceForm />} />
          <Route path="bookings" element={<BookingsAdmin />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
        </Route>

        {/* 404 Error */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;