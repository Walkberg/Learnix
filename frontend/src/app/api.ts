import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Base API URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for AI operations
});

// Request interceptor - attach JWT token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear auth token
      localStorage.removeItem('auth_token');

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded:', error.response.data);
    }

    // Handle 500+ Server Errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    // Handle Network Errors
    if (error.message === 'Network Error') {
      console.error('Network error: Unable to reach the server');
    }

    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export default api;
