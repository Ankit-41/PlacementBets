// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jobjinxbackend.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios interceptors
  useEffect(() => {
    // Request interceptor
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Clear auth state on 401 errors
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const setSession = (token, userData) => {
    if (token && userData) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setSession(null, null);
        return;
      }

      const response = await api.get('/auth/me');
      setSession(token, response.data.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setSession(null, null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on mount and setup refresh interval
  useEffect(() => {
    checkAuth();

    // Periodically check auth status (optional)
    const interval = setInterval(checkAuth, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      setSession(response.data.token, response.data.data.user);
      setError(null);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/signup', userData);
      setSession(response.data.token, response.data.data.user);
      setError(null);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.get('/auth/logout');
      setSession(null, null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add method to update user tokens
  const updateUserTokens = (newTokenAmount) => {
    if (user) {
      const updatedUser = {
        ...user,
        tokens: newTokenAmount
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Method to refresh user data from server
  const refreshUserData = async () => {
    try {
      const response = await axios.get('https://jobjinxbackend.vercel.app/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    updateUserTokens, // Add this to the context value
    refreshUserData,  // Add this to the context value
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};