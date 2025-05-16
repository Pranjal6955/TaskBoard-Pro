import api from './api';

export const getProjectAutomations = async (projectId) => {
  const response = await api.get(`/automations/project/${projectId}`);
  return response.data;
};

export const createAutomation = async (automationData) => {
  const response = await api.post('/automations', automationData);
  return response.data;
};

export const updateAutomation = async (automationId, automationData) => {
  const response = await api.put(`/automations/${automationId}`, automationData);
  return response.data;
};

export const deleteAutomation = async (automationId) => {
  const response = await api.delete(`/automations/${automationId}`);
  return response.data;
};

export const getUserBadges = async () => {
  const response = await api.get('/automations/badges');
  return response.data;
};

export const getUserNotifications = async () => {
  const response = await api.get('/automations/notifications');
  return response.data;
};
