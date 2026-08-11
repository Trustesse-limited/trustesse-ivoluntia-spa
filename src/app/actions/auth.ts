'use server';

import {
  volunteerSignUp,
  organizationSignUp,
  verifyOtp,
  resendOtp,
  login,
  resetPassword,
  volunteerOnboarding,
  organizationOnboarding,
  getCountries,
  getStates,
} from '@/lib/server-api';
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
import { cookies } from 'next/headers';
import {
  sanitizeEmail,
  sanitizePassword,
  sanitizeOtp,
  isValidEmail,
} from '@/lib/sanitize';

/**
 * Server Action for Volunteer Sign Up (initial auth info)
 * This can be called from client components but executes on the server
 * POST /api/v1/Auth/volunteer-signup
 */
export async function volunteerSignUpAction(data: VolunteerSignUpRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // SECURITY: Never log sensitive authentication data including passwords
    console.log('Server Action: volunteerSignUpAction called');

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: VolunteerSignUpRequest = {
      authInfo: {
        email: sanitizeEmail(data.authInfo.email),
        password: sanitizePassword(data.authInfo.password),
        confirmPassword: sanitizePassword(data.authInfo.confirmPassword),
        hasAgreedToTermsAndCondition: data.authInfo.hasAgreedToTermsAndCondition,
      },
    };

    if (!isValidEmail(sanitizedData.authInfo.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await volunteerSignUp(sanitizedData);
    console.log('Server Action: API response received');

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.log('Server Action: Error caught:', error);
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to sign up volunteer',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for Organization Sign Up (initial foundation admin info)
 * This can be called from client components but executes on the server
 * POST /api/v1/Auth/organization-signup
 */
export async function organizationSignUpAction(data: OrganizationSignUpRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // SECURITY: Never log sensitive authentication data including passwords
    console.log('Server Action: organizationSignUpAction called');

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: OrganizationSignUpRequest = {
      foundationAdminInfo: {
        email: sanitizeEmail(data.foundationAdminInfo.email),
        password: sanitizePassword(data.foundationAdminInfo.password),
        confirmPassword: sanitizePassword(data.foundationAdminInfo.confirmPassword),
        hasAgreedToTermsAndCondition: data.foundationAdminInfo.hasAgreedToTermsAndCondition,
      },
    };

    if (!isValidEmail(sanitizedData.foundationAdminInfo.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await organizationSignUp(sanitizedData);
    console.log('Server Action: API response received');

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.log('Server Action: Error caught:', error);
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to sign up organization',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for OTP Verification
 * This can be called from client components but executes on the server
 * POST /api/v1/Auth/verify-otp
 */
export async function verifyOtpAction(data: OtpVerificationRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: OtpVerificationRequest = {
      email: sanitizeEmail(data.email),
      otpCode: sanitizeOtp(data.otpCode),
    };

    if (!isValidEmail(sanitizedData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    console.log('Server Action: verifyOtpAction called');
    const response: ApiResponse<unknown> = await verifyOtp(sanitizedData);
    console.log('Server Action: API response received:', JSON.stringify(response, null, 2));

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.log('Server Action: Error caught:', error);
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to verify OTP',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for Resending OTP
 * This can be called from client components but executes on the server
 * POST /api/v1/Otp/resendotp
 */
export async function resendOtpAction(data: ResendOtpRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: ResendOtpRequest = {
      email: sanitizeEmail(data.email),
      purpose: data.purpose,
    };

    if (!isValidEmail(sanitizedData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    console.log('Server Action: resendOtpAction called');
    const response: ApiResponse<unknown> = await resendOtp(sanitizedData);
    console.log('Server Action: API response received:', JSON.stringify(response, null, 2));

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.log('Server Action: Error caught:', error);
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to resend OTP',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for Login
 * This can be called from client components but executes on the server
 */
export async function loginAction(data: LoginRequestModel): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}> {
  try {
    // SECURITY: Never log login credentials
    console.log('Server Action: loginAction called');

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: LoginRequestModel = {
      email: sanitizeEmail(data.email),
      password: sanitizePassword(data.password),
      rememberMe: data.rememberMe,
      twoFactorCode: data.twoFactorCode ? sanitizeOtp(data.twoFactorCode) : undefined,
      deviceInfo: data.deviceInfo,
    };

    if (!isValidEmail(sanitizedData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await login(sanitizedData);

    // SECURITY: Store tokens in HTTP-only cookies for security
    const loginData = response.data as Record<string, unknown> | undefined;
    
    if (loginData) {
      const cookieStore = await cookies();
      
      // Store access token
      if ('accessToken' in loginData && typeof loginData.accessToken === 'string') {
        cookieStore.set('access_token', loginData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
      
      // Store refresh token
      if ('refreshToken' in loginData && typeof loginData.refreshToken === 'string') {
        cookieStore.set('refresh_token', loginData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      
      // Store user role in cookie if available
      if ('accountType' in loginData && typeof loginData.accountType === 'string') {
        cookieStore.set('user_role', loginData.accountType.toLowerCase().replace(' ', '_'), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to login',
    };
  }
}

/**
 * Server Action for Reset Password
 * This can be called from client components but executes on the server
 */
export async function resetPasswordAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedEmail = sanitizeEmail(email);

    if (!isValidEmail(sanitizedEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await resetPassword(sanitizedEmail);

    return {
      success: true,
      message: (response.data as { message?: string })?.message || 'Password reset email sent successfully',
    };
  } catch (error) {
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to reset password',
    };
  }
}

/**
 * Server Action for Logout
 * Removes the auth token from HTTP-only cookie
 */
export async function logoutAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('user_role');

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to logout',
    };
  }
}

/**
 * Server Action for Volunteer Onboarding
 * This can be called from client components but executes on the server
 * POST /api/v1/Onboarding/volunteer-onboarding
 */
export async function volunteerOnboardingAction(data: VolunteerOnboardingRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // SECURITY: Never log sensitive data
    console.log('🔵 [Server Action] volunteerOnboardingAction called');
    console.log('📤 [Server Action] Request Payload:', JSON.stringify(data, null, 2));

    // SECURITY: Server-side sanitization
    const sanitizedData: VolunteerOnboardingRequest = {
      onboardingMetaData: {
        accountType: data.onboardingMetaData.accountType,
        currentPage: data.onboardingMetaData.currentPage,
      },
      bioData: {
        firstName: data.bioData.firstName.trim(),
        lastName: data.bioData.lastName.trim(),
        gender: data.bioData.gender,
        dateOfBirth: data.bioData.dateOfBirth,
      },
      locationDto: {
        address: data.locationDto.address?.trim() || '',
        city: data.locationDto.city?.trim() || '',
        zipCode: data.locationDto.zipCode?.trim() || '',
        countryId: data.locationDto.countryId?.trim() || '',
        stateId: data.locationDto.stateId?.trim() || '',
      },
      interest: {
        names: data.interest.names || [],
      },
      skill: {
        names: data.skill.names || [],
      },
      profileAndBioData: {
        bio: data.profileAndBioData.bio?.trim() || '',
        profileImageurl: data.profileAndBioData.profileImageurl,
      },
    };

    const response: ApiResponse<unknown> = await volunteerOnboarding(sanitizedData);
    console.log('🟢 [Server Action] API response received');
    console.log('✅ [Server Action] Response Data:', JSON.stringify(response, null, 2));

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.log('🔴 [Server Action] Error caught:', error);
    const apiError = error as ApiError;

    return {
      success: false,
      error: apiError.message || 'Failed to complete volunteer onboarding',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for Organization Onboarding
 * This can be called from client components but executes on the server
 * POST /api/v1/Onboarding/organization-onboarding
 */
export async function organizationOnboardingAction(data: OrganizationOnboardingRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // SECURITY: Never log sensitive data
    console.log('🔵 [Server Action] organizationOnboardingAction called');
    console.log('📤 [Server Action] Request Payload:', JSON.stringify(data, null, 2));

    // SECURITY: Server-side sanitization
    const sanitizedData: OrganizationOnboardingRequest = {
      metaData: {
        accountType: data.metaData.accountType,
        currentPage: data.metaData.currentPage,
      },
      foundationBioData: {
        name: data.foundationBioData.name.trim(),
        foundationCategory: data.foundationBioData.foundationCategory.trim(),
        website: data.foundationBioData.website?.trim(),
        mission: data.foundationBioData.mission.trim(),
      },
      foundationLocationDto: {
        address: data.foundationLocationDto.address?.trim(),
        city: data.foundationLocationDto.city?.trim() || '',
        zipcode: data.foundationLocationDto.zipcode?.trim() || '',
        foundationCountry: data.foundationLocationDto.foundationCountry?.trim() || '',
        foundationState: data.foundationLocationDto.foundationState?.trim() || '',
        countryId: data.foundationLocationDto.countryId?.trim(),
        stateId: data.foundationLocationDto.stateId?.trim(),
        userId: data.foundationLocationDto.userId?.trim(),
      },
      causeDto: {
        names: data.causeDto.names || [],
      },
      profileLogo: {
        logo: data.profileLogo.logo,
      },
      disclaimer: {
        hasAgreedToDisclaimer: data.disclaimer.hasAgreedToDisclaimer,
      },
    };

    const response: ApiResponse<unknown> = await organizationOnboarding(sanitizedData);
    console.log('🟢 [Server Action] API response received');
    console.log('✅ [Server Action] Response Data:', JSON.stringify(response, null, 2));

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.log('🔴 [Server Action] Error caught:', error);
    const apiError = error as ApiError;

    return {
      success: false,
      error: apiError.message || 'Failed to complete organization onboarding',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action to Get Countries
 * This can be called from client components but executes on the server
 * GET /api/v1/countries/countries
 */
export async function getCountriesAction(): Promise<{
  success: boolean;
  data?: Country[];
  error?: string;
}> {
  try {
    console.log('🔵 [Server Action] getCountriesAction called');
    const countries = await getCountries();
    console.log('🟢 [Server Action] Countries fetched successfully');

    return {
      success: true,
      data: countries,
    };
  } catch (error) {
    console.log('🔴 [Server Action] Error fetching countries:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch countries',
    };
  }
}

/**
 * Server Action to Get States by Country ID
 * This can be called from client components but executes on the server
 * GET /api/v1/countries/states?countryId={countryId}
 */
export async function getStatesAction(countryId: string): Promise<{
  success: boolean;
  data?: State[];
  error?: string;
}> {
  try {
    console.log('🔵 [Server Action] getStatesAction called with countryId:', countryId);
    const states = await getStates(countryId);
    console.log('🟢 [Server Action] States fetched successfully');

    return {
      success: true,
      data: states,
    };
  } catch (error) {
    console.log('🔴 [Server Action] Error fetching states:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch states',
    };
  }
}