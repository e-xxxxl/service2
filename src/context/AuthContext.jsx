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

  const API_URL = import.meta.env.VITE_API_URL || 'https://service-server-e64r.onrender.com/api';

  // Check existing session
  // context/AuthContext.jsx - Update checkAuth
useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        console.log('Checking auth with token...');
        
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const result = await response.json();
          const userData = result.data || result.user || result;
          
          console.log('Auth check successful:', userData);
          
          setUser(userData);
          setIsEmailVerified(userData?.isEmailVerified || false);
        } else {
          console.log('Auth check failed, clearing token');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_URL]);

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

  // context/AuthContext.jsx - Update verifyEmail function
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
      
      // Store account type for routing
      if (userData) {
        localStorage.setItem('userAccountType', userData.accountType);
        setUser(userData);
        setIsEmailVerified(true);
      }
    }

    return result; // Make sure to return the result
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