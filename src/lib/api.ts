import axios, { AxiosError } from 'axios';
import axiosInstance from './axios';
import { ApiResponse, ApiError, PaginationParams, PaginatedResponse } from '@/types/api';

// NOTE: This file is for client-side API calls only
// For server-side API calls (authentication, sensitive operations), use server-api.ts
// Server-side functions have access to API_BASE_URL (not prefixed with NEXT_PUBLIC)


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
  
  volunteers: {
    getAll: (params?: PaginationParams) => 
      apiClient.getPaginated('/volunteers', params),
    getById: (id: string) => 
      apiClient.get(`/volunteers/${id}`),
    create: (data: Record<string, unknown>) => 
      apiClient.post('/volunteers', data),
    update: (id: string, data: Record<string, unknown>) => 
      apiClient.put(`/volunteers/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`/volunteers/${id}`),
  },
  
  opportunities: {
    getAll: (params?: PaginationParams) => 
      apiClient.getPaginated('/opportunities', params),
    getById: (id: string) => 
      apiClient.get(`/opportunities/${id}`),
    create: (data: Record<string, unknown>) => 
      apiClient.post('/opportunities', data),
    update: (id: string, data: Record<string, unknown>) => 
      apiClient.put(`/opportunities/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`/opportunities/${id}`),
  },
};

export default api;
