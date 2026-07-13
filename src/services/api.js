// src/services/api.js - Update token retrieval
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  // Check for both possible token keys
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
    // Handle 401 specifically
    if (res.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

export const api = {
  getDashboard: () => request('/customer/dashboard'),
  searchPros: (params) => request(`/customer/search?${new URLSearchParams(params)}`),
  toggleFavorite: (proId) => request(`/customer/favorites/${proId}`, { method: 'POST' }),
  markNotificationRead: (id) => request(`/customer/notifications/${id}/read`, { method: 'PATCH' }),
  sendMessage: (proId, text) =>
    request(`/customer/conversations/${proId}/messages`, { 
      method: 'POST', 
      body: JSON.stringify({ text }) 
    }),
};