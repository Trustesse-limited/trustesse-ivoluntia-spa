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
} from '@/types/api';

// Server-side only axios instance (cannot be used in client components)
const serverAxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 20000,
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
 * Volunteer Sign Up (initial auth info only)
 * POST /api/v1/Auth/volunteer-signup
 */
export async function volunteerSignUp(
  data: VolunteerSignUpRequest
): Promise<ApiResponse<unknown>> {
  try {
    console.log('🔵 [API] POST /api/v1/Auth/volunteer-signup');
    console.log('🔵 [API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/volunteer-signup',
      data
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
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
    console.log('🔵 [API] POST /api/v1/Auth/organization-signup');
    console.log('🔵 [API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/organization-signup',
      data
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
    throw handleServerError(error);
  }
}

/**
 * Verify OTP (email verification)
 * POST /api/v1/Auth/confirmuser?otpCode=xxx
 */
export async function verifyOtp(
  data: OtpVerificationRequest
): Promise<ApiResponse<unknown>> {
  try {
    console.log('🔵 [API] POST /api/v1/Auth/confirmuser');
    console.log('🔵 [API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/confirmuser',
      null,
      {
        params: {
          otpCode: data.otpCode,
        },
      }
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
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
    console.log('🔵 [API] POST /api/v1/Otp/resendotp');
    console.log('🔵 [API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Otp/resendotp',
      null,
      {
        params: {
          email: data.email,
          purpose: data.purpose,
        },
      }
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
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
    console.log('🔵 [API] POST /api/v1/Auth/login');
    console.log('🔵 [API] Request Payload:', { ...data, password: '[REDACTED]' });
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/login',
      data
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
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
    console.log('🔵 [API] POST /api/v1/Auth/resetpassword');
    console.log('🔵 [API] Request Payload:', { email });
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Auth/resetpassword',
      email,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
    throw handleServerError(error);
  }
}

/**
 * Volunteer Onboarding (complete onboarding data)
 * POST /api/v1/Onboarding/volunteer-onboarding
 */
export async function volunteerOnboarding(
  data: VolunteerOnboardingRequest
): Promise<ApiResponse<unknown>> {
  try {
    console.log('🔵 [API] POST /api/v1/Onboarding/volunteer-onboarding');
    console.log('🔵 [API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Onboarding/volunteer-onboarding',
      data
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
    throw handleServerError(error);
  }
}

/**
 * Organization Onboarding (complete onboarding data)
 * POST /api/v1/Onboarding/organization-onboarding
 */
export async function organizationOnboarding(
  data: OrganizationOnboardingRequest
): Promise<ApiResponse<unknown>> {
  try {
    console.log('🔵 [API] POST /api/v1/Onboarding/organization-onboarding');
    console.log('🔵 [API] Request Payload:', JSON.stringify(data, null, 2));
    
    const response = await serverAxiosInstance.post<ApiResponse<unknown>>(
      '/api/v1/Onboarding/organization-onboarding',
      data
    );
    
    console.log('🟢 [API] Response Status:', response.status);
    console.log('🟢 [API] Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('🔴 [API] Error Status:', error.response?.status);
      console.log('🔴 [API] Error Response:', JSON.stringify(error.response?.data, null, 2));
    }
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
 * GET /api/v1/countries/countries
 */
export async function getCountries(): Promise<Country[]> {
  try {
    console.log("🔵 [API] GET /api/v1/countries/countries");
    
    const response = await serverAxiosInstance.get<ApiResponse<Country[]>>(
      "/api/v1/countries/countries"
    );
    
    console.log("🟢 [API] Response Status:", response.status);
    console.log("🟢 [API] Response Data:", JSON.stringify(response.data, null, 2));
    
    
    interface CountryApiResponse {
      countryId?: string;
      countryName?: string;
      id?: string;
      name?: string;
      code?: string;
      isoCode?: string;
    }

    interface CountryApiResponseWrapper {
      responseCode: number;
      responseMessage: string;
      data: {
        statusCode: number;
        message: string;
        data: CountryApiResponse[];
      };
    }
    const rawData = (response.data as unknown as CountryApiResponseWrapper).data.data;
    return rawData.map((c: CountryApiResponse) => ({
      id: c.countryId || c.id || '',
      name: c.countryName || c.name || '',
      countryId: c.countryId || c.id || '',
      countryName: c.countryName || c.name || '',
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("🔴 [API] Error Status:", error.response?.status);
      console.log("🔴 [API] Error Response:", JSON.stringify(error.response?.data, null, 2));
    }
    throw handleServerError(error);
  }
}

interface StateApiResponse {
      stateId?: string;
      stateName?: string;
      id?: string;
      name?: string;
      countryId?: string;
      code?: string;
    }
    interface StateApiResponseWrapper {
      responseCode: number;
      responseMessage: string;
      data: {
        statusCode: number;
        message: string;
        data: StateApiResponse[];
      };
    }
/**
 * Get states by country ID
 * GET /api/v1/countries/states?countryId={countryId}
 */
export async function getStates(countryId: string): Promise<State[]> {
  try {
    console.log("🔵 [API] GET /api/v1/countries/states");
    console.log("📤 [API] Request Params:", { countryId });
    
    const response = await serverAxiosInstance.get<ApiResponse<State[]>>(
      "/api/v1/countries/states",
      {
        params: { countryId },
      }
    );
    
    console.log("🟢 [API] Response Status:", response.status);
    console.log("🟢 [API] Response Data:", JSON.stringify(response.data, null, 2));
    const rawData = (response.data as unknown as StateApiResponseWrapper).data.data;
    return rawData.map((s: StateApiResponse): State => ({
      id: s.stateId || s.id || '',
      name: s.stateName || s.name || '',
      stateId: s.stateId || s.id || '',
      stateName: s.stateName || s.name || '',
      countryId: s.countryId || '',
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("🔴 [API] Error Status:", error.response?.status);
      console.log("🔴 [API] Error Response:", JSON.stringify(error.response?.data, null, 2));
    }
    throw handleServerError(error);
  }
}
