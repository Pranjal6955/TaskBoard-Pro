import api from './api';
import { registerWithBackend } from './authService';

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Update user profile (PUT /users/profile)
export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Create or update user (POST /users)
export const createOrUpdateUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// Get user stats (GET /users/me/stats)
export const getUserStats = async () => {
  const response = await api.get('/users/me/stats');
  return response.data;
};

// Search users by email (GET /users/search?email=)
export const getUsersByEmail = async (email) => {
  const response = await api.get(`/users/search?email=${email}`);
  return response.data;
};

// Send user data to backend after Firebase auth
export const registerUserAfterGoogleLogin = async (user) => {
  try {
    // First get a JWT token from our backend
    const { token } = await registerWithBackend(user);
    
    // Store token in localStorage for future requests
    localStorage.setItem('authToken', token);
    
    // Now use the JWT token for user creation/update
    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || '',
    };

    const response = await createOrUpdateUser(userData);
    console.log('User registered in database:', response);
    return response;
  } catch (error) {
    console.error('Error registering user in database:', error);
    throw error;
  }
};

// Verify connection between frontend and backend
export const verifyApiConnection = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API connection error:', error);
    throw error;
  }
};
