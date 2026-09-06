/**
 * Client-side API Configuration
 * 
 * 
 * This application uses HTTP-only cookies for JWT token storage.
 * All sensitive API calls should use server actions for maximum security.
 * This client-side API layer is limited to non-sensitive operations only.
 * 
 * For authentication and sensitive operations, use server actions from:
 * - @/app/actions/auth.ts
 * - @/app/actions/tokenRefresh.ts
 * 
 * Security Features:
 * - Credentials automatically sent via HTTP-only cookies
 * - No token exposure to client-side JavaScript
 * - Server-side validation and authorization
 */

import axios, { AxiosError } from 'axios';
import axiosInstance from './axios';
import { ApiResponse, ApiError, PaginationParams, PaginatedResponse } from '@/types/api';
import { API_ENDPOINTS } from './api-config';


class ApiClient {
  /**
   * Generic GET request
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get paginated data
   */
  async getPaginated<T>(
    url: string,
    params?: PaginationParams & Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): ApiError {
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
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export specific API endpoints (add more as needed)
export const api = {
  // NOTE: Authentication endpoints are NOT included here for security
  // Use server-api.ts for volunteer signup and login operations
  // This file is for non-sensitive client-side API calls only
  
  // WARNING: These endpoints should only be used for non-sensitive data
  // For sensitive operations, create server actions in @/app/actions/
  
  volunteers: {
    getAll: (params?: PaginationParams) => 
      apiClient.getPaginated(API_ENDPOINTS.volunteers.getByFoundation, params),
    getById: (id: string) => 
      apiClient.get(`${API_ENDPOINTS.volunteers.getByFoundation}/${id}`),
    create: (data: Record<string, unknown>) => 
      apiClient.post(API_ENDPOINTS.volunteers.getByFoundation, data),
    update: (id: string, data: Record<string, unknown>) => 
      apiClient.put(`${API_ENDPOINTS.volunteers.getByFoundation}/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`${API_ENDPOINTS.volunteers.getByFoundation}/${id}`),
  },
  
  opportunities: {
    getAll: (params?: PaginationParams) => 
      apiClient.getPaginated(API_ENDPOINTS.programs.getAll, params),
    getById: (id: string) => 
      apiClient.get(API_ENDPOINTS.programs.getById(id)),
    create: (data: Record<string, unknown>) => 
      apiClient.post(API_ENDPOINTS.programs.create, data),
    update: (id: string, data: Record<string, unknown>) => 
      apiClient.put(API_ENDPOINTS.programs.update, data),
    delete: (id: string) => 
      apiClient.delete(API_ENDPOINTS.programs.deleteGoal),
  },
  
  // Additional client-side endpoints can be added here
  // using the API_ENDPOINTS from api-config.ts
};

export default api;
