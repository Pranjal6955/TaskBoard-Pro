import api from './api';

// Status mapping between frontend and backend
export const statusMapping = {
  'todo': 'To Do',
  'in-progress': 'In Progress', 
  'done': 'Done'
};

export const getBackendStatus = (frontendStatus) => {
  return statusMapping[frontendStatus] || frontendStatus;
};

export const getFrontendStatus = (backendStatus) => {
  // Reverse mapping
  for (const [key, value] of Object.entries(statusMapping)) {
    if (value === backendStatus) return key;
  }
  return backendStatus.toLowerCase().replace(/\s+/g, '-');
};

export const getProjectTasks = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}`);
  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  // Map the status to the backend expected format
  const formattedData = { 
    ...taskData, 
    status: taskData.status ? getBackendStatus(taskData.status) : undefined
  };
  const response = await api.post('/tasks', formattedData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  // Map the status to the backend expected format if it's present
  const formattedData = { ...taskData };
  if (formattedData.status) {
    formattedData.status = getBackendStatus(formattedData.status);
  }
  const response = await api.put(`/tasks/${taskId}`, formattedData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    // Handle 404 errors silently - task is already deleted
    if (error.response && error.response.status === 404) {
      console.log('Task is already deleted or not found');
      return { success: true, message: 'Task is already deleted' };
    }
    // For other errors, throw normally
    throw error;
  }
};

export const moveTask = async (taskId, status) => {
  const backendStatus = getBackendStatus(status);
  const response = await api.patch(`/tasks/${taskId}/status`, { status: backendStatus });
  return response.data;
};

// Get tasks assigned to the current user
export const getUserTasks = async () => {
  const response = await api.get('/tasks/user/assigned');
  return response.data;
};
