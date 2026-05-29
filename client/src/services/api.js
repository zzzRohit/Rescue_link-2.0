import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://rescue-link-backend.onrender.com'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rescuelink_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
