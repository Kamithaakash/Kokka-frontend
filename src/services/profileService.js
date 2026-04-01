import api from './api';

export const getMyProfile = () => api.get('/profiles/me');
export const updateMyProfile = (data) => api.put('/profiles/me', data);
export const uploadPhotos = (formData) =>
  api.post('/profiles/me/photos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePhoto = (photoUrl) => api.delete('/profiles/me/photos', { data: { photoUrl } });
export const setProfilePhoto = (photoUrl) => api.patch('/profiles/me/profile-photo', { photoUrl });
export const getProfileById = (id) => api.get(`/profiles/${id}`);
export const searchProfiles = (params) => api.get('/search', { params });
export const reportProfile = (profileId, data) => api.post(`/profiles/${profileId}/report`, data);
