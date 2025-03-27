import api from './api';

export const getAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServices = async () => {
  try {
    const response = await api.get('/admin/services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await api.post('/admin/services', serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/admin/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/admin/services/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};