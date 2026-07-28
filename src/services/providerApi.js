// services/providerApi.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
    }
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

export const api = {
  // Dashboard
  getDashboard: () => request('/provider/dashboard'),
  
  // Profile Updates
  updateProfile: (profileData) => 
    request('/provider/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
    
  updateBasicInfo: (data) =>
    request('/provider/profile/basic', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  updateBusinessInfo: (data) =>
    request('/provider/profile/business', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  updateSocialLinks: (data) =>
    request('/provider/profile/social', {
      method: 'PUT',
      body: JSON.stringify({ socialLinks: data })
    }),
  
  // Availability
  updateAvailability: (isAvailable) => 
    request('/provider/availability', { 
      method: 'PATCH', 
      body: JSON.stringify({ isAvailable }) 
    }),
  
  // Jobs
  respondToJob: (jobId, response) =>
    request(`/provider/jobs/${jobId}/respond`, {
      method: 'POST',
      body: JSON.stringify(response)
    }),
  
  // Messages
  getMessages: () => request('/provider/messages'),
  sendMessage: (customerId, text) =>
    request(`/provider/messages/${customerId}`, {
      method: 'POST',
      body: JSON.stringify({ text })
    }),
  
  // Notifications
  markNotificationRead: (id) =>
    request(`/provider/notifications/${id}/read`, { method: 'PATCH' })
};