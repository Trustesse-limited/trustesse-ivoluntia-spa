import axios, { AxiosError } from 'axios';
import { VolunteerSignUpDto, LoginRequestModel, ApiResponse, ApiError } from '@/types/api';

// Server-side only axios instance (cannot be used in client components)
const serverAxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for server-side
serverAxiosInstance.interceptors.request.use(
  (config) => {
    // Add server-side auth tokens if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for server-side
serverAxiosInstance.interceptors.response.use(
  (response) => {
    // Log the full response for debugging
    console.log('Server API Response:', {
      status: response.status,
      data: response.data,
    });
    
    // Check if response contains error even with 2xx status
    const responseData = response.data as ApiResponse<unknown>;
    // Only treat as error if success is explicitly false
    if (responseData && responseData.success === false) {
      const error: ApiError = {
        message: responseData.message || 'Request failed',
        status: response.status || 400,
      };
      console.error('Server API Error (2xx with error):', error);
      return Promise.reject(error);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error('Server API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Server API No Response:', error.message);
    } else {
      console.error('Server API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Server-side API functions for authentication
 * These can only be used in server components, API routes, and server actions
 */

/**
 * Volunteer Sign Up / Onboarding
 * POST /api/v1/Auth/volunteer
 */
export async function volunteerSignUp(
  data: VolunteerSignUpDto
): Promise<ApiResponse<unknown>> {
  try {
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/volunteer',
      data
    );
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Login
 * POST /api/v1/Auth/login
 */
export async function login(
  data: LoginRequestModel
): Promise<ApiResponse<unknown>> {
  try {
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/login',
      data
    );
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Reset Password
 * POST /api/v1/Auth/resetpassword
 * Takes email as a string directly (not an object)
 */
export async function resetPassword(
  email: string
): Promise<ApiResponse<unknown>> {
  try {
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/resetpassword',
      email,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Handle server-side API errors
 */
function handleServerError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const apiError: ApiError = {
      message: (axiosError.response?.data as { message?: string })?.message || axiosError.message || 'An error occurred',
      status: axiosError.response?.status || 500,
      errors: (axiosError.response?.data as { errors?: Record<string, string[]> })?.errors,
    };
    return apiError;
  }
  
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
}

export default serverAxiosInstance;
