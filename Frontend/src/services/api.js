import axios from 'axios';
import { auth } from '../firebase/config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
api.interceptors.request.use(async (config) => {
  try {
    // First try to get token from localStorage (our JWT token)
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
      return config;
    }
    
    // If no stored token, try to get from Firebase
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error setting auth token:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401 || error.response.status === 403) {
        console.log('Authentication error. Token may be expired.');
        // Clear stored token on auth errors
        localStorage.removeItem('authToken');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
