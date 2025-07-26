// src/axiosConfig.js
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

// Automatically attach token (if exists)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token; // OR use Authorization: `Bearer ${token}`
  }
  return config;
});

export default axiosInstance;
