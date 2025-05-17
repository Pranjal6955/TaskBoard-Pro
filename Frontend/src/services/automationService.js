import api from './api';

/**
 * Get all automation rules for a project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Array>} Array of automation rules
 */
export const getProjectAutomations = async (projectId) => {
  try {
    const response = await api.get(`/automations/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project automations:', error);
    throw error;
  }
};

/**
 * Create a new automation rule
 * @param {Object} automationData - The automation rule data
 * @returns {Promise<Object>} The created automation rule
 */
export const createAutomation = async (automationData) => {
  try {
    const response = await api.post('/automations', automationData);
    return response.data;
  } catch (error) {
    console.error('Error creating automation:', error);
    throw error;
  }
};

/**
 * Update an existing automation rule
 * @param {string} automationId - The ID of the automation to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The updated automation rule
 */
export const updateAutomation = async (automationId, updateData) => {
  try {
    const response = await api.put(`/automations/${automationId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating automation:', error);
    throw error;
  }
};

/**
 * Delete an automation rule
 * @param {string} automationId - The ID of the automation to delete
 * @returns {Promise<void>}
 */
export const deleteAutomation = async (automationId) => {
  try {
    await api.delete(`/automations/${automationId}`);
  } catch (error) {
    console.error('Error deleting automation:', error);
    throw error;
  }
};

/**
 * Get user badges
 * @returns {Promise<Array>} Array of user badges
 */
export const getUserBadges = async () => {
  try {
    const response = await api.get('/automations/badges');
    return response.data;
  } catch (error) {
    console.error('Error fetching user badges:', error);
    throw error;
  }
};

/**
 * Get user notifications
 * @returns {Promise<Array>} Array of user notifications
 */
export const getUserNotifications = async () => {
  try {
    const response = await api.get('/automations/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The ID of the notification
 * @returns {Promise<Object>} The updated notification
 */
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await api.patch(`/automations/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
