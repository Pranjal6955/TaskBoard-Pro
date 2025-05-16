import api from './api';

export const getTaskComments = async (taskId) => {
  const response = await api.get(`/comments/task/${taskId}`);
  return response.data;
};

export const createComment = async (commentData) => {
  const response = await api.post('/comments', commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};
