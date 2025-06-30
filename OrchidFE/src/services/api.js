import axios from 'axios';
import { navigateTo } from '../utils/navigation';
/**
 * API Service Configuration
 * 
 * This module configures and exports an axios instance with interceptors for:
 * - Authentication token management
 * - Request/response logging
 * - Error handling with specific status code responses
 * - Retry logic for failed requests
 */

// Create a reusable axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request logging and authentication interceptor
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development mode
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, 
        config.params || config.data || {});
    }
    
    // Add authentication token if available
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response handling and error interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development mode
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`, 
        response.data);
    }
    return response;
  },
  async (error) => {
    // Extract error details
    const originalRequest = error.config;
    
    // Handle response errors
    if (error.response) {
      // Log error details
      console.error('API Error:', {
        status: error.response.status,
        url: originalRequest.url,
        method: originalRequest.method,
        data: error.response.data
      });
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401: // Unauthorized
          // Clear authentication data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('storage'));
          // Dispatch storage event to notify other components
          navigateTo('/login');
          // Redirect to login page if not already there
          break;
          
        case 403: // Forbidden
          console.error('Access forbidden. Insufficient permissions.');
          break;
          
        case 404: // Not Found
          console.error('Resource not found.');
          break;
          
        case 500: // Server Error
          console.error('Server error occurred.');
          break;
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network Error:', error.request);
      
      // Implement retry logic for network errors (max 2 retries)
      if (!originalRequest._retry && originalRequest.method === 'get') {
        originalRequest._retry = true;
        try {
          return await api(originalRequest);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common API operations
api.handleError = (error) => {
  const message = 
    error.response?.data?.message || 
    error.message || 
    'An unexpected error occurred';
  
  return { error: true, message };
};

export default api;