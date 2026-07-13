// services/authService.js
const API_BASE_URL =  'http://localhost:5000/api';

class AuthService {
  static async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static login(email, password) {
    return this.request('http://localhost:5000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static signup(userData) {
    return this.request('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static verifyEmail(token) {
    return this.request('http://localhost:5000/api/auth/verify-email/${token}', {
      method: 'POST',
    });
  }

  static resendVerification(email) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static resetPassword(token, password) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }
}

export default AuthService;