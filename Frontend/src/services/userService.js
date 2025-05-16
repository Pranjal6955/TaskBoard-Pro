import api from './api';

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
