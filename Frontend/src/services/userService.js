import api from './api';

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const getUsersByEmail = async (email) => {
  const response = await api.get(`/users/search?email=${email}`);
  return response.data;
};
