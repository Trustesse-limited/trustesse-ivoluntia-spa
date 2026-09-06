/**
 * Client-side Axios Configuration
 * 
 * SECURITY ARCHITECTURE: Pure Server-Side Authentication
 * 
 * This application uses HTTP-only cookies for JWT token storage, which is the industry standard
 * for secure authentication. Tokens are never exposed to client-side JavaScript.
 * 
 * Key Security Features:
 * - JWT tokens stored in HTTP-only cookies (inaccessible to JavaScript)
 * - Credentials automatically sent with requests (withCredentials: true)
 * - No localStorage usage (eliminates XSS vulnerabilities)
 * - Server-side token validation and refresh
 * - Automatic cookie management by browser
 * 
 * Public endpoints (signup, login, etc.) exclude credentials to prevent unnecessary cookie transmission.
 * Authenticated endpoints automatically include cookies for authentication.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  isPublicEndpoint,
  getCookieAuthConfig,
} from '@/lib/authToken.client';

// Create axios instance with base configuration (client-side)
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie-based authentication
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Configure credentials based on endpoint type
    const authConfig = getCookieAuthConfig(config.url || '');
    config.withCredentials = authConfig.withCredentials;
    
    // Log request for debugging
    console.log('🔵 [Client API] Request:', config.method?.toUpperCase(), config.url);
    if (config.data) {
      console.log('📤 [Client API] Request Payload:', JSON.stringify(config.data, null, 2));
    }
    if (config.params) {
      console.log('📤 [Client API] Request Params:', JSON.stringify(config.params, null, 2));
    }
    
    // NOTE: Authorization headers are automatically handled by HTTP-only cookies
    // The browser will send cookies with requests when withCredentials is true
    // No manual token injection needed - this is more secure
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('🟢 [Client API] Response Status:', response.status);
    console.log('📥 [Client API] Response Data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error: AxiosError) => {
    console.log('🔴 [Client API] Error:', error.message);
    if (error.response) {
      console.log('🔴 [Client API] Error Status:', error.response.status);
      console.log('🔴 [Client API] Error Data:', JSON.stringify(error.response.data, null, 2));
      
      const status = error.response.status;
      
      // Server responded with error status
      switch (status) {
        case 401:
          error.message = 'Authentication failed. Please log in again.';
          break;
        case 403:
          error.message = 'You do not have permission to access this resource.';
          break;
        case 404:
          error.message = 'The requested resource was not found.';
          break;
        case 500:
          error.message = 'Internal server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
