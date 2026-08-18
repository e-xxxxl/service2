// services/api.js
import { friendlyErrorMessage } from '../utils/apiError';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://service-server-e64r.onrender.com/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (err) {
    throw new Error(friendlyErrorMessage(err), { cause: err });
  }

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
  getDashboard: () => request('/customer/dashboard'),
  
  searchPros: (queryString) => {
    const url = queryString ? `/customer/search?${queryString}` : '/customer/search';
    return request(url);
  },

    getProviderProfile: (id) => request(`/customer/provider/${id}`),
  
  toggleFavorite: (proId) => request(`/customer/favorites/${proId}`, { method: 'POST' }),
  
  markNotificationRead: (id) => request(`/customer/notifications/${id}/read`, { method: 'PATCH' }),
  
  // FIXED: Use correct endpoint
  sendMessage: (proId, text) =>
    request(`/customer/messages/${proId}`, {  // ← Changed from conversations to messages
      method: 'POST', 
      body: JSON.stringify({ text }) 
    }),
    
  // Get messages/conversations
  getMessages: () => request('/customer/messages'),
  getConversation: (conversationId) => request(`/customer/messages/${conversationId}`),
};