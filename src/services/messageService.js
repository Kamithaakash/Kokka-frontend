import api from './api';

export const getInbox = () => api.get('/messages');
export const getConversation = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (userId, text) => api.post(`/messages/${userId}`, { text });
export const markAsRead = (userId) => api.patch(`/messages/${userId}/read`);
