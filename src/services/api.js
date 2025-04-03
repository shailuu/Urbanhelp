// services/api.js
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

// Create User
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/admin/users', userData);
    return response.data; // Return the newly created user data
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
