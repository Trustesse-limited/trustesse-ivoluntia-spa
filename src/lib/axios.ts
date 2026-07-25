import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base configuration (server-side only)
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
          // Handle unauthorized - maybe redirect to login
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.status);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.message);
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
