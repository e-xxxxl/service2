// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Check existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const result = await response.json();
          const userData = result.data || result.user || result;
          setUser(userData);
          setIsEmailVerified(userData?.isEmailVerified || false);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log('Login attempt:', credentials.email);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();
    console.log('Login response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Invalid email or password');
    }

    // Handle different response structures
    const token = result.token || result.data?.token;
    const userData = result.user || result.data?.user || result.data;

    if (!token) {
      console.error('No token in response:', result);
      throw new Error('No token received from server');
    }

    localStorage.setItem('authToken', token);
    setUser(userData);
    setIsEmailVerified(userData?.isEmailVerified || false);

    return result;
  };

  const signup = async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }

    return result;
  };

  const verifyEmail = async (token) => {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'POST',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Email verification failed');
    }

    const accessToken = result.token || result.data?.token;
    const userData = result.user || result.data?.user || result.data;

    if (accessToken) {
      localStorage.setItem('authToken', accessToken);
      setUser(userData);
      setIsEmailVerified(true);
    }

    return result;
  };

  const resendVerification = async (email) => {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to resend verification email');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsEmailVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isEmailVerified,
        login,
        signup,
        verifyEmail,
        resendVerification,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};