import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with auth token
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Users
export const getUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating user' };
  }
};

// Contacts
export const getContacts = async () => {
  const response = await apiClient.get('/admin/contacts');
  return response.data;
};

export const updateContact = async (id, contactData) => {
  const response = await apiClient.put(`/admin/contacts/${id}`, contactData);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await apiClient.delete(`/admin/contacts/${id}`);
  return response.data;
};

export const createContact = async (contactData) => {
  try {
    const response = await apiClient.post('/admin/contacts', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating contact' };
  }
};

// Work With Us
export const getWorkWithUs = async () => {
  const response = await apiClient.get('/admin/workwithus');
  return response.data;
};

export const updateWorkWithUs = async (id, applicationData) => {
  const response = await apiClient.put(`/admin/workwithus/${id}`, applicationData);
  return response.data;
};

export const deleteWorkWithUs = async (id) => {
  const response = await apiClient.delete(`/admin/workwithus/${id}`);
  return response.data;
};

export const createWorkWithUs = async (applicationData) => {
  const response = await apiClient.post('/admin/workwithus', applicationData);
  return response.data;
};

export const approveWorker = async (id) => {
  try {
    const response = await apiClient.post(`/admin/workwithus/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error approving worker' };
  }
};

// Services
export const getServices = async () => {
  const response = await apiClient.get('/admin/services');
  return response.data;
};

export const createService = async (serviceData) => {
  try {
    // When serviceData is FormData, axios will automatically 
    // set the correct Content-Type header with boundary
    const response = await apiClient.post('/admin/services', serviceData, {
      headers: {
        // Don't set Content-Type when sending FormData - axios will set it correctly
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating service' };
  }
};

export const updateService = async (id, serviceData) => {
  try {
    // Check if serviceData is FormData (for image uploads)
    const isFormData = serviceData instanceof FormData;
    
    const response = await apiClient.put(`/admin/services/${id}`, serviceData, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data'
      } : undefined
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating service' };
  }
};

export const deleteService = async (id) => {
  const response = await apiClient.delete(`/admin/services/${id}`);
  return response.data;
};

// Approved Workers
export const getApprovedWorkers = async () => {
  try {
    const response = await apiClient.get('/admin/approved-workers');
    return response.data.workers || response.data; // Handle both response structures
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching approved workers' };
  }
};

export const createApprovedWorker = async (workerData) => {
  const response = await apiClient.post('/admin/approved-workers', workerData);
  return response.data;
};

export const updateApprovedWorker = async (id, workerData) => {
  const response = await apiClient.put(`/admin/approved-workers/${id}`, workerData);
  return response.data;
};

export const deleteApprovedWorker = async (id) => {
  const response = await apiClient.delete(`/admin/approved-workers/${id}`);
  return response.data;
};

// Bookings
export const getAllBookings = async () => {
  try {
    const response = await apiClient.get('/admin/bookings');
    return response.data.bookings || response.data; // Handle both response structures
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching bookings' };
  }
};

export const getApprovedBookings = async () => {
  try {
    const response = await apiClient.get('/admin/approved-bookings');
    return response.data.approvedBookings || response.data; // Handle both response structures
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching approved bookings' };
  }
};

export const approveBooking = async (id, data) => {
  try {
    // Updated to send the worker ID in the request body
    const response = await apiClient.post(`/admin/bookings/${id}/approve`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error approving booking' };
  }
};

export const disapproveBooking = async (id) => {
  try {
    const response = await apiClient.post(`/admin/bookings/${id}/disapprove`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error disapproving booking' };
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting booking' };
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await apiClient.put(`/admin/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating booking' };
  }
};


// Notifications
export const getNotifications = async (userEmail) => {
  try {
    const response = await apiClient.get(`/notifications?userEmail=${userEmail}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching notifications' };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error marking notification as read' };
  }
};

export const markAllNotificationsAsRead = async (userEmail) => {
  try {
    const response = await apiClient.put(`/notifications/mark-all-read?userEmail=${userEmail}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error marking all notifications as read' };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting notification' };
  }
};