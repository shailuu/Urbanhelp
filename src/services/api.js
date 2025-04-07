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

// ✅ New: Create Contact
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

// ✅ New: Approve Worker (Change status to 'accepted')
export const approveWorker = async (id) => {
  try {
    const response = await apiClient.patch(`/admin/workwithus/${id}/approve`);
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
    const response = await apiClient.post('/admin/services', serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating service' };
  }
};

export const updateService = async (id, serviceData) => {
  const response = await apiClient.put(`/admin/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await apiClient.delete(`/admin/services/${id}`);
  return response.data;
};

export const getApprovedWorkers = async () => {
  const response = await apiClient.get('/admin/approved-workers');
  return response.data;
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
