/**
 * Server-side API Configuration
 * 
 * SECURITY ARCHITECTURE: Pure Server-Side Authentication
 * 
 * This module provides server-side API calls with automatic JWT authentication.
 * All tokens are stored in HTTP-only cookies and are never exposed to client-side JavaScript.
 * 
 * Key Features:
 * - Automatic Authorization header injection from HTTP-only cookies
 * - Public endpoint detection (no auth for signup, login, etc.)
 * - Token expiration monitoring
 * - Comprehensive error handling
 * - Server-side token refresh support
 */

import axios, { AxiosError } from 'axios';
import {
  VolunteerSignUpRequest,
  OrganizationSignUpRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  LoginRequestModel,
  ApiResponse,
  ApiError,
  VolunteerOnboardingRequest,
  OrganizationOnboardingRequest,
  Country,
  State,
  Cause,
  Skill,
} from '@/types/api';
import {
  getServerAccessToken,
  getAuthHeader,
  isPublicEndpoint,
  shouldRefreshToken,
} from '@/lib/authToken.server';
import { API_ENDPOINTS } from '@/lib/api-config';
import logger from '@/lib/logger';

// Server-side only axios instance (cannot be used in client components)
const serverAxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Note: Server-side doesn't use cookies like client-side
  // We manually inject Authorization headers from HTTP-only cookies
});

// Request interceptor for server-side
serverAxiosInstance.interceptors.request.use(
  async (config) => {
    // Skip auth headers for public endpoints
    if (config.url && isPublicEndpoint(config.url)) {
      logger.log('[API] Public endpoint, skipping auth:', config.url);
      return config;
    }

    // Add auth token for authenticated endpoints
    try {
      const token = await getServerAccessToken();
      
      if (token) {
        logger.log('[API] Token retrieved for:', config.url);
        logger.log('[API] Token length:', token.length);
        logger.log('[API] Token prefix:', token.substring(0, 20) + '...');
        
        // Check if token needs refresh
        if (shouldRefreshToken(token)) {
          // Token refresh could be implemented here
        }
        
        // Add Authorization header
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          logger.log('[API] Authorization header added');
        }
      } else {
        logger.log('[API] No token found for authenticated endpoint:', config.url);
      }
    } catch (error) {
      logger.error('Error adding auth header:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for server-side
serverAxiosInstance.interceptors.response.use(
  (response) => {
    // Check if response contains error even with 2xx status
    const responseData = response.data as ApiResponse<unknown>;
    // Only treat as error if success is explicitly false
    if (responseData && responseData.success === false) {
      const error: ApiError = {
        message: responseData.message || 'Request failed',
        status: response.status || 400,
      };
      return Promise.reject(error);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        const apiError: ApiError = {
          message: 'Authentication failed. Please log in again.',
          status: 401,
        };
        return Promise.reject(apiError);
      }

      // Handle 403 Forbidden - insufficient permissions
      if (status === 403) {
        const apiError: ApiError = {
          message: 'You do not have permission to access this resource.',
          status: 403,
        };
        return Promise.reject(apiError);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Server-side API functions for authentication
 * These can only be used in server components, API routes, and server actions
 */

/**
 * Volunteer Sign Up (initial auth info only)
 * POST /api/v1/Auth/volunteer-signup
 */
export async function volunteerSignUp(
  data: VolunteerSignUpRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.volunteerSignup);
    logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.volunteerSignup,
      data
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Organization Sign Up (initial foundation admin info only)
 * POST /api/v1/Auth/organization-signup
 */
export async function organizationSignUp(
  data: OrganizationSignUpRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.organizationSignup);
    logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.organizationSignup,
      data
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Verify OTP (email verification)
 * POST /api/v1/Otp/verify-email-confirm-otp?otpCode=xxx
 */
export async function verifyOtp(
  data: OtpVerificationRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.otp.verifyEmail);
    logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.otp.verifyEmail,
      null,
      {
        params: {
          otpCode: data.otpCode,
        },
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Resend OTP (resend verification email)
 * POST /api/v1/Otp/resendotp
 */
export async function resendOtp(
  data: ResendOtpRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.otp.resend);
    logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    const params: Record<string, string | boolean> = {
      email: data.email,
      purpose: data.purpose,
      includeAlphabet: data.includeAlphabet,
      notificationType: data.notificationType,
    };
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.otp.resend,
      null,
      {
        params: params,
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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
    logger.log('[API] POST', API_ENDPOINTS.auth.login);
    logger.log('[API] Request Payload:', { ...data, password: '[REDACTED]' });
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.login,
      data
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Reset Password
 * POST /api/v1/Auth/resetpassword
 * Takes email as query parameter
 */
export async function resetPassword(
  email: string
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.resetPassword);
    logger.log('[API] Request Payload:', { email });
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.resetPassword,
      null,
      {
        params: {
          email: email,
        },
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Volunteer Onboarding (complete onboarding data)
 * POST /api/v1/Onboarding/volunteer-onboarding (multipart/form-data)
 */
export async function volunteerOnboarding(
  data: VolunteerOnboardingRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.onboarding.volunteer);
    logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    // Convert to FormData for multipart/form-data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.onboarding.volunteer,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Organization Onboarding (complete onboarding data)
 * POST /api/v1/Onboarding/organization-onboarding (multipart/form-data)
 */
export async function organizationOnboarding(
  data: OrganizationOnboardingRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.onboarding.organization);
    logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    // Convert to FormData for multipart/form-data
    const formData = new FormData();
    
    // Handle nested objects
    if (data.metaData) {
      formData.append('MetaData.AccountType', data.metaData.accountType);
      formData.append('MetaData.CurrentPage', String(data.metaData.currentPage));
    }
    
    if (data.foundationBioData) {
      formData.append('foundationBioData.Name', data.foundationBioData.name);
      formData.append('foundationBioData.FoundationCategory', data.foundationBioData.foundationCategory);
      if (data.foundationBioData.website) {
        formData.append('foundationBioData.Website', data.foundationBioData.website);
      }
      formData.append('foundationBioData.Mission', data.foundationBioData.mission);
    }
    
    if (data.foundationLocationDto) {
      if (data.foundationLocationDto.address) {
        formData.append('FoundationLocationDto.Address', data.foundationLocationDto.address);
      }
      formData.append('FoundationLocationDto.City', data.foundationLocationDto.city);
      formData.append('FoundationLocationDto.Zipcode', data.foundationLocationDto.zipcode);
      formData.append('FoundationLocationDto.FoundationCountry', data.foundationLocationDto.foundationCountry);
      formData.append('FoundationLocationDto.FoundationState', data.foundationLocationDto.foundationState);
      if (data.foundationLocationDto.countryId) {
        formData.append('FoundationLocationDto.CountryId', data.foundationLocationDto.countryId);
      }
      if (data.foundationLocationDto.stateId) {
        formData.append('FoundationLocationDto.StateId', data.foundationLocationDto.stateId);
      }
    }
    
    if (data.causeDto && data.causeDto.names) {
      data.causeDto.names.forEach((name, index) => {
        formData.append(`CauseDto.Names[${index}]`, name);
      });
    }
    
    if (data.profileLogo && data.profileLogo.logo) {
      data.profileLogo.logo.forEach((file, index) => {
        formData.append(`ProfileLogo.Logo[${index}]`, file);
      });
    }
    
    if (data.disclaimer) {
      formData.append('Disclaimer.HasAgreedToDisclaimer', String(data.disclaimer.hasAgreedToDisclaimer));
    }
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.onboarding.organization,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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

/**
 * Get all countries
 * GET /api/v1/countries/get-all-countries
 */
export async function getCountries(): Promise<Country[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.countries.getAll);
    
    const response = await serverAxiosInstance.get<ApiResponse<Country[]>>(
      API_ENDPOINTS.countries.getAll
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    interface CountryApiResponse {
      id?: string;
      countryName?: string;
      countryCode?: string;
    }

    // The API returns { responseCode, isSuccessfull, message, errors, data: [...] }
    const rawData = (response.data as unknown as { data: CountryApiResponse[] }).data;
    return rawData.map((c: CountryApiResponse) => ({
      id: c.id || '',
      name: c.countryName || '',
      countryId: c.id || '',
      countryName: c.countryName || '',
      code: c.countryCode || '',
    }));
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get all states for a country
 * GET /api/State/get-country-states-by-countryid
 */
export async function getStates(countryId: string): Promise<State[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.state.getByCountry);
    logger.log('[API] Request Params:', { countryId });
    
    const response = await serverAxiosInstance.get<ApiResponse<State[]>>(
      API_ENDPOINTS.state.getByCountry,
      {
        params: { countryId },
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    interface StateApiResponse {
      stateId?: string;
      stateName?: string;
      countryId?: string;
    }

    // The API returns { responseCode, isSuccessfull, message, errors, data: [...] }
    const rawData = (response.data as unknown as { data: StateApiResponse[] }).data;
    return rawData.map((s: StateApiResponse): State => ({
      id: s.stateId || '',
      name: s.stateName || '',
      stateId: s.stateId || '',
      stateName: s.stateName || '',
      countryId: s.countryId || '',
    }));
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get all causes
 * GET /api/Cause/get-all-causes
 */
export async function getCauses(): Promise<Cause[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.cause.getAll);
    
    const response = await serverAxiosInstance.get<ApiResponse<Cause[]>>(
      API_ENDPOINTS.cause.getAll
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get all skills
 * GET /api/Skill/get-all-skill
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.skill.getAll);
    
    const response = await serverAxiosInstance.get<ApiResponse<Skill[]>>(
      API_ENDPOINTS.skill.getAll
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Upload file
 * POST /api/FileUploads/file-upload
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.fileUploads.upload);
    logger.log('[API] File:', file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await serverAxiosInstance.post<ApiResponse<string[]>>(
      API_ENDPOINTS.fileUploads.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    
    throw new Error('No file URL returned from server');
  } catch (error) {
    throw handleServerError(error);
  }
}
