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
  VolunteerProfile,
  FoundationProfile,
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
  Interest,
  Skill,
  CategoryApiResponse,
  TwoFactorVerificationRequest,
  TokenRefreshRequest,
  ProgramApiResponse,
  CreateProgramRequest,
  UpdateProgramRequest,
  UpdateProgramStatusRequest,
  JoinProgramRequest,
  LeaveProgramRequest,
  DeleteProgramGoalRequest,
  CreateLocationRequest,
  Qualification,
  CreateQualificationRequest,
  UpdateQualificationRequest,
} from '@/types/api';
import {
  getServerAccessToken,
  isPublicEndpoint,
  shouldRefreshToken,
} from '@/lib/authToken.server';
import { API_ENDPOINTS } from '@/lib/api-config';
import logger from '@/lib/logger';

// Server-side only axios instance (cannot be used in client components)
const serverAxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 60000,
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
      // logger.log('[API] Public endpoint, skipping auth:', config.url);
      return config;
    }

    // Add auth token for authenticated endpoints
    try {
      const token = await getServerAccessToken();
      
      if (token) {
        // logger.log('[API] Token retrieved for:', config.url);
        // logger.log('[API] Token length:', token.length);
        // logger.log('[API] Token prefix:', token.substring(0, 20) + '...');
        
        // Check if token needs refresh
        if (shouldRefreshToken(token)) {
          // Token refresh could be implemented here
        }
        
        // Add Authorization header
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          // logger.log('[API] Authorization header added');
        }
      } else {
        // logger.log('[API] No token found for authenticated endpoint:', config.url);
      }
    } catch (error) {
      const err = error as Error;
      logger.error('Error adding auth header:', err.message);
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
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.volunteerSignup,
      data
    );
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.organizationSignup,
      data
    );
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.otp.verifyEmail,
      null,
      {
        params: {
          otpCode: data.otpCode,
        },
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Verify 2FA Code (for super-admin and 2FA-enabled accounts)
 * POST /api/v1/Auth/2fa-verify
 */
export async function verifyTwoFactor(
  data: TwoFactorVerificationRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.twoFactorVerify);
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.twoFactorVerify,
      data
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Refresh Token
 * POST /api/v1/Auth/refresh-token
 */
export async function refreshToken(
  data: TokenRefreshRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.refreshToken);

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.refreshToken,
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
 * Resend OTP (resend verification email)
 * POST /api/v1/Otp/resendotp
 */
export async function resendOtp(
  data: ResendOtpRequest
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.otp.resend);
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
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
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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
    // logger.log('[API] Request Payload:', { ...data, password: '[REDACTED]' });
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.login,
      data
    );
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Forgot Password (reset password with OTP)
 * POST /api/v1/Auth/forgotpassword
 * Takes email, newPassword, confirmPassword, and token (OTP) as request body
 */
export async function forgotPassword(
  email: string,
  newPassword: string,
  confirmPassword: string,
  token: string
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.forgotPassword);

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.forgotPassword,
      {
        email,
        newPassword,
        confirmPassword,
        token,
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
 * Verify Reset Password OTP (verification only)
 * POST /api/v1/Otp/verify-reset-password-otp?otpCode=xxx
 */
export async function verifyResetPasswordOtp(
  otpCode: string
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.otp.verifyResetPassword);
    // logger.log('[API] Request Payload:', { otpCode });

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.otp.verifyResetPassword,
      null,
      {
        params: {
          otpCode: otpCode,
        },
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Verify Reset Password (with password reset)
 * POST /api/v1/Otp/verify-reset-password-otp
 * Takes email, newPassword, confirmPassword, and token (OTP) as request body
 */
export async function verifyResetPassword(
  email: string,
  newPassword: string,
  confirmPassword: string,
  token: string
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.otp.verifyResetPassword);
    // logger.log('[API] Request Payload:', { email, newPassword: '[REDACTED]', confirmPassword: '[REDACTED]', token });

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.otp.verifyResetPassword,
      {
        email,
        newPassword,
        confirmPassword,
        token,
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Reset Forgot Password
 * POST /api/v1/Auth/resetforgotpassword
 * Takes email as query parameter (public endpoint)
 */
export async function resetForgotPassword(
  email: string
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.auth.resetForgotPassword);
    // logger.log('[API] Request Payload:', { email });

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.resetForgotPassword,
      null,
      {
        params: {
          email: email,
        },
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Verify Forgot Password OTP
 * POST /api/v1/Otp/verify-forgot-password-otp
 * Takes otpCode as query parameter (public endpoint)
 * Returns a token that must be used in the reset password API
 */
export async function verifyForgotPasswordOtp(
  otpCode: string
): Promise<ApiResponse<{ token: string }>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.otp.verifyForgotPassword);
    // logger.log('[API] Request Payload:', { otpCode });

    const response = await serverAxiosInstance.post<ApiResponse<{ token: string }>>(
      API_ENDPOINTS.otp.verifyForgotPassword,
      null,
      {
        params: {
          otpCode: otpCode,
        },
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

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
    // logger.log('[API] Request Payload:', { email });

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.auth.resetPassword,
      null,
      {
        params: {
          email: email,
        },
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

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
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));
    
    // Convert to FormData for multipart/form-data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          // Don't send Files anymore - we send URLs after upload
          if (item) {
            formData.append(`${key}[${index}]`, item);
          }
        });
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
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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
    // logger.log('[API] Request Payload:', JSON.stringify(data, null, 2));

    // Convert to FormData for multipart/form-data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item) {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      API_ENDPOINTS.onboarding.organization,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get Volunteer Profile
 * GET /api/UserProfile/volunteer-profile
 */
export async function getVolunteerProfile(): Promise<ApiResponse<VolunteerProfile>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.userProfile.volunteerProfile);

    const response = await serverAxiosInstance.get<ApiResponse<VolunteerProfile>>(
      API_ENDPOINTS.userProfile.volunteerProfile
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getVolunteerProfile:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get Foundation Profile
 * GET /api/UserProfile/foundation-profile
 */
export async function getFoundationProfile(): Promise<ApiResponse<FoundationProfile>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.userProfile.foundationProfile);

    const response = await serverAxiosInstance.get<ApiResponse<FoundationProfile>>(
      API_ENDPOINTS.userProfile.foundationProfile
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getFoundationProfile:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Create Program
 * POST /api/Programs/create
 */
export async function createProgram(request: CreateProgramRequest): Promise<ApiResponse<ProgramApiResponse>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.programs.create);
    logger.log('[API] Request:', request);

    const response = await serverAxiosInstance.post<ApiResponse<ProgramApiResponse>>(
      API_ENDPOINTS.programs.create,
      request
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in createProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get Programs
 * GET /api/Programs/get-programs
 *
 * Query params mirror the swagger definition (PageNumber/PageSize are
 * capitalized there; ASP.NET binding is case-insensitive but we match the
 * documented names exactly). The response is returned untyped because the
 * envelope is not documented: it may be a bare array or a paginated object.
 * parseProgramsResponse in the server actions normalizes every shape.
 */
export async function getPrograms(params?: {
  PageNumber?: number;
  PageSize?: number;
  foundationId?: string;
  status?: string;
  search?: string;
  dateRange?: string;
}): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.programs.getAll);
    logger.log('[API] Params:', params);

    const response = await serverAxiosInstance.get<ApiResponse<unknown>>(
      API_ENDPOINTS.programs.getAll,
      { params }
    );

    logger.log('[API] Response Status:', response.status);

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getPrograms:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get Organizations
 * GET /api/Organization/get
 *
 * Used to fetch organization options for admin program management filters.
 */
export async function getOrganizations(params?: {
  Page?: number;
  PageSize?: number;
  Status?: string;
  All?: boolean;
  SearchQuery?: string;
  OrderByColumn?: string;
  OrderBy?: string;
}): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.organization.get);
    logger.log('[API] Params:', params);

    const response = await serverAxiosInstance.get<ApiResponse<unknown>>(
      API_ENDPOINTS.organization.get,
      { params }
    );

    logger.log('[API] Response Status:', response.status);

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getOrganizations:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get Program Stats
 * GET /api/Programs/get-program-stats
 */
export async function getProgramStats(foundationId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.programs.getAll, 'stats');
    logger.log('[API] Foundation ID:', foundationId);

    const response = await serverAxiosInstance.get<ApiResponse<Record<string, unknown>>>(
      '/api/Programs/get-program-stats',
      { params: { foundationId } }
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getProgramStats:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get Program By ID
 * GET /api/Programs/get-program-by-id
 */
export async function getProgramById(id: string): Promise<ApiResponse<ProgramApiResponse>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.programs.getById(id));

    const response = await serverAxiosInstance.get<ApiResponse<ProgramApiResponse>>(
      API_ENDPOINTS.programs.getById(id)
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getProgramById:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Update Program
 * PUT /api/Programs/update
 */
export async function updateProgram(request: UpdateProgramRequest): Promise<ApiResponse<ProgramApiResponse>> {
  try {
    logger.log('[API] PUT', API_ENDPOINTS.programs.update);
    logger.log('[API] Request:', request);

    const response = await serverAxiosInstance.put<ApiResponse<ProgramApiResponse>>(
      API_ENDPOINTS.programs.update,
      request
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in updateProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Delete Program Goal
 * DELETE /api/Programs/delete-program-goal
 */
export async function deleteProgramGoal(programGoalId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] DELETE', API_ENDPOINTS.programs.deleteGoal);
    logger.log('[API] Program Goal ID:', programGoalId);

    const response = await serverAxiosInstance.delete<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.programs.deleteGoal,
      { params: { programGoalId } }
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in deleteProgramGoal:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Delete Program
 * DELETE /api/Programs/delete-program
 */
export async function deleteProgram(programId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] DELETE', '/api/Programs/delete-program');
    logger.log('[API] Program ID:', programId);

    const response = await serverAxiosInstance.delete<ApiResponse<Record<string, unknown>>>(
      '/api/Programs/delete-program',
      { params: { programId } }
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in deleteProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Update Program Status
 * PUT /api/Programs/updateprogramstatus
 */
export async function updateProgramStatus(request: UpdateProgramStatusRequest): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] PUT', API_ENDPOINTS.programs.updateStatus);
    logger.log('[API] Request:', request);

    const response = await serverAxiosInstance.put<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.programs.updateStatus,
      request
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in updateProgramStatus:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Join Program
 * POST /api/Programs/join-program
 */
export async function joinProgram(programId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.programs.join);
    logger.log('[API] Program ID:', programId);

    const response = await serverAxiosInstance.post<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.programs.join,
      {},
      { params: { programId } }
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in joinProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Leave Program
 * POST /api/Programs/leave-program
 */
export async function leaveProgram(programId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.programs.leave);
    logger.log('[API] Program ID:', programId);

    const response = await serverAxiosInstance.post<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.programs.leave,
      {},
      { params: { programId } }
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in leaveProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Add Favorite Program
 * POST /api/FavoritePrograms/add-favorite-program
 */
export async function addFavoriteProgram(programId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.favoritePrograms.add);
    logger.log('[API] Program ID:', programId);

    const response = await serverAxiosInstance.post<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.favoritePrograms.add,
      { programId }
    );

    logger.log('[API] Response Status:', response.status);

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in addFavoriteProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get Favorite Programs (the current user's favourites)
 * GET /api/FavoritePrograms/get-favorite-programs
 */
export async function getFavoritePrograms(): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.favoritePrograms.get);

    const response = await serverAxiosInstance.get<ApiResponse<unknown>>(
      API_ENDPOINTS.favoritePrograms.get
    );

    logger.log('[API] Response Status:', response.status);

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getFavoritePrograms:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Remove Favorite Program
 * DELETE /api/FavoritePrograms/remove-favorite-program?programId=...
 */
export async function removeFavoriteProgram(programId: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] DELETE', API_ENDPOINTS.favoritePrograms.remove);
    logger.log('[API] Program ID:', programId);

    const response = await serverAxiosInstance.delete<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.favoritePrograms.remove,
      { params: { programId } }
    );

    logger.log('[API] Response Status:', response.status);

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in removeFavoriteProgram:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Get All Favorite Programs (paginated)
 * GET /api/FavoritePrograms/get-all-favorite-programs
 */
export async function getAllFavoritePrograms(params?: {
  PageNumber?: number;
  PageSize?: number;
}): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.favoritePrograms.getAll);
    logger.log('[API] Params:', params);

    const response = await serverAxiosInstance.get<ApiResponse<unknown>>(
      API_ENDPOINTS.favoritePrograms.getAll,
      { params }
    );

    logger.log('[API] Response Status:', response.status);

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in getAllFavoritePrograms:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Create Location
 * POST /api/Location/create-location
 */
export async function createLocation(request: CreateLocationRequest): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.location.create);
    logger.log('[API] Request:', request);

    const response = await serverAxiosInstance.post<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.location.create,
      request
    );

    logger.log('[API] Response Status:', response.status);
    logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const apiError = error as AxiosError;
    logger.error('[API] Error in createLocation:', {
      status: apiError.response?.status,
      message: apiError.response?.data || apiError.message,
    });
    throw handleServerError(error);
  }
}

/**
 * Handle server-side API errors
 */
function handleServerError(error: unknown): ApiError {
  // The response interceptor converts 401/403 (and `success: false` bodies)
  // into a plain ApiError before this runs — preserve its status and message
  // instead of flattening it into a generic 500, otherwise callers can never
  // tell an expired session (401) apart from a real server fault.
  if (
    !axios.isAxiosError(error) &&
    error !== null &&
    typeof error === 'object' &&
    'status' in error &&
    'message' in error
  ) {
    return error as ApiError;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    // Support camelCase response bodies and ASP.NET-style bodies
    // ({ StatusCode, Message, Details }) — e.g. Data Protection key-ring
    // failures only surface their explanation in `Details`.
    const data = axiosError.response?.data as
      | { message?: string; detail?: string; Details?: string; Message?: string }
      | undefined;
    const apiError: ApiError = {
      message:
        data?.message ||
        data?.detail ||
        data?.Details ||
        data?.Message ||
        axiosError.message ||
        'An error occurred',
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
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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
    // logger.log('[API] Request Params:', { countryId });
    
    const response = await serverAxiosInstance.get<ApiResponse<State[]>>(
      API_ENDPOINTS.state.getByCountry,
      {
        params: { countryId },
      }
    );
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
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

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get all interests
 * GET /api/Interest/get-interests
 */
export async function getInterests(): Promise<Interest[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.interest.getAll);

    const response = await serverAxiosInstance.get<ApiResponse<Interest[]>>(
      API_ENDPOINTS.interest.getAll
    );

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Upload a file
 * POST /api/FileUploads/file-upload (multipart/form-data)
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.fileUploads.upload);
    // logger.log('[API] Uploading file:', file.name, file.type, file.size);

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

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    // The API returns an array of URLs, we take the first one
    const urls = response.data.data || [];
    if (urls.length === 0) {
      throw new Error('No URL returned from upload API');
    }

    return urls[0];
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

    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));

    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get all qualifications
 * GET /api/Qualification
 */
export async function getQualifications(): Promise<Qualification[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.qualification.getAll);

    const response = await serverAxiosInstance.get<ApiResponse<Qualification[]>>(
      API_ENDPOINTS.qualification.getAll
    );

    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Create qualification
 * POST /api/Qualification/creation
 */
export async function createQualification(
  data: CreateQualificationRequest
): Promise<ApiResponse<Qualification>> {
  try {
    logger.log('[API] POST', API_ENDPOINTS.qualification.create);

    const response = await serverAxiosInstance.post<ApiResponse<Qualification>>(
      API_ENDPOINTS.qualification.create,
      data
    );

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Update qualification
 * PUT /api/Qualification/{qualificationId}
 */
export async function updateQualification(
  qualificationId: string,
  data: UpdateQualificationRequest
): Promise<ApiResponse<Qualification>> {
  try {
    logger.log('[API] PUT', API_ENDPOINTS.qualification.update(qualificationId));

    const response = await serverAxiosInstance.put<ApiResponse<Qualification>>(
      API_ENDPOINTS.qualification.update(qualificationId),
      data
    );

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Delete qualification
 * DELETE /api/Qualification/{qualificationId}
 */
export async function deleteQualification(
  qualificationId: string
): Promise<ApiResponse<unknown>> {
  try {
    logger.log('[API] DELETE', API_ENDPOINTS.qualification.delete(qualificationId));

    const response = await serverAxiosInstance.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.qualification.delete(qualificationId)
    );

    return response.data;
  } catch (error) {
    throw handleServerError(error);
  }
}

/**
 * Get all categories
 * GET /api/Category/get-all-category
 */
export async function getCategories(): Promise<CategoryApiResponse[]> {
  try {
    logger.log('[API] GET', API_ENDPOINTS.category.getAll);
    
    const response = await serverAxiosInstance.get<ApiResponse<CategoryApiResponse[]>>(
      API_ENDPOINTS.category.getAll
    );
    
    // logger.log('[API] Response Status:', response.status);
    // logger.log('[API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data.data || [];
  } catch (error) {
    throw handleServerError(error);
  }
}
