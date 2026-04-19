// src/services/authService.js
import axiosInstance from './api';  // your axios with interceptors

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};