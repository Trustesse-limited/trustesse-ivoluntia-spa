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
  getCauses,
  getSkills,
  uploadFile,
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
  Cause,
  Skill,
} from '@/types/api';
import { cookies } from 'next/headers';
import {
  sanitizeEmail,
  sanitizePassword,
  sanitizeOtp,
  isValidEmail,
} from '@/lib/sanitize';
import logger from '@/lib/logger';

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
    logger.log('[Server Action] volunteerSignUpAction called');
    
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: VolunteerSignUpRequest = {
      email: sanitizeEmail(data.email),
      password: sanitizePassword(data.password),
      confirmPassword: sanitizePassword(data.confirmPassword),
      hasAgreedToTermsAndCondition: data.hasAgreedToTermsAndCondition,
    };

    if (!isValidEmail(sanitizedData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await volunteerSignUp(sanitizedData);
    
    logger.log('[Server Action] volunteerSignUpAction completed');

    // Set user role cookie for volunteer
    const cookieStore = await cookies();
    cookieStore.set('user_role', 'volunteer', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    logger.log('[Server Action] volunteerSignUpAction error:', error);
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
    logger.log('[Server Action] organizationSignUpAction called');
    
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: OrganizationSignUpRequest = {
      email: sanitizeEmail(data.email),
      password: sanitizePassword(data.password),
      confirmPassword: sanitizePassword(data.confirmPassword),
      hasAgreedToTermsAndCondition: data.hasAgreedToTermsAndCondition,
    };

    if (!isValidEmail(sanitizedData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await organizationSignUp(sanitizedData);
    
    logger.log('[Server Action] organizationSignUpAction completed');

    // Set user role cookie for organization
    const cookieStore = await cookies();
    cookieStore.set('user_role', 'organization', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    logger.log('[Server Action] organizationSignUpAction error:', error);
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
    logger.log('[Server Action] verifyOtpAction called');
    
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: OtpVerificationRequest = {
      otpCode: sanitizeOtp(data.otpCode),
    };

    if (!sanitizedData.otpCode || sanitizedData.otpCode.length !== 6) {
      return {
        success: false,
        error: 'Please enter a valid 6-digit OTP',
      };
    }

    const response: ApiResponse<unknown> = await verifyOtp(sanitizedData);
    
    logger.log('[Server Action] verifyOtpAction completed');

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    logger.log('[Server Action] verifyOtpAction error:', error);
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
      includeAlphabet: data.includeAlphabet,
      notificationType: data.notificationType,
    };

    if (!isValidEmail(sanitizedData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    logger.log('[Server Action] resendOtpAction called');
    const response: ApiResponse<unknown> = await resendOtp(sanitizedData);
    logger.log('[Server Action] resendOtpAction completed');

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    logger.log('[Server Action] resendOtpAction error:', error);
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
    logger.log('[Server Action] loginAction called');
    
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
    logger.log('[Server Action] loginAction completed');
    logger.log('[Server Action] Full login response:', JSON.stringify(response.data, null, 2));

    // SECURITY: Store tokens in HTTP-only cookies for security
    const loginData = response.data as Record<string, unknown> | undefined;
    
    if (loginData) {
      logger.log('[Server Action] loginData keys:', Object.keys(loginData));
      logger.log('[Server Action] loginData.nameid:', loginData.nameid);
      logger.log('[Server Action] loginData.email:', loginData.email);
      logger.log('[Server Action] loginData.userProfile:', loginData.userProfile);
      
      // TEMPORARY WORKAROUND: Extract user data from JWT token since userProfile is null
      // This will be removed once backend fixes the userProfile field
      let userData: Record<string, unknown> | null = null;
      if ('accessToken' in loginData && typeof loginData.accessToken === 'string') {
        try {
          const tokenParts = loginData.accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            logger.log('[Server Action] Decoded JWT payload:', payload);
            userData = {
              id: payload.nameid || payload.sub || '',
              email: payload.email || payload.unique_name || '',
              role: payload.role || '',
              firstName: payload.given_name || '',
              lastName: payload.family_name || '',
              organizationName: payload.OrganizationName || '',
              foundationId: payload.FoundationId || '',
            };
            logger.log('[Server Action] Extracted user data from JWT:', userData);
          }
        } catch (error) {
          logger.error('[Server Action] Failed to decode JWT:', error);
        }
      }
      
      // Attach extracted user data to loginData for use in client
      if (userData) {
        (loginData as Record<string, unknown>).extractedUserData = userData;
      }
      
      const cookieStore = await cookies();
      
      // Store access token as auth_token for consistency
      if ('accessToken' in loginData && typeof loginData.accessToken === 'string') {
        cookieStore.set('auth_token', loginData.accessToken, {
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
          path: '/',
        });
      }
      
      // Store onboarding status in cookie for redirect logic
      if ('hasCompletedOnboarding' in loginData) {
        cookieStore.set('has_completed_onboarding', String(loginData.hasCompletedOnboarding), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
      }
      
      // Store last completed page for onboarding resume
      if (loginData && 'lastCompletedPage' in loginData && typeof loginData.lastCompletedPage === 'number') {
        cookieStore.set('last_completed_page', String(loginData.lastCompletedPage), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
      }
      
      logger.log('[Server Action] Returning loginData with extractedUserData:', (loginData as Record<string, unknown>).extractedUserData);
      
      return {
        success: true,
        data: loginData,
        message: 'Login successful',
      };
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
 * Removes the auth token from HTTP-only cookie and clears all auth-related data
 */
export async function logoutAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    
    // Delete all auth-related cookies by setting them to expire immediately
    const cookiesToDelete = [
      'auth_token',
      'access_token',
      'user_role',
      'refresh_token',
      'has_completed_onboarding',
      'last_completed_page',
    ];
    
    cookiesToDelete.forEach(cookieName => {
      // Try multiple methods to ensure cookie deletion
      cookieStore.delete(cookieName);
      cookieStore.set(cookieName, '', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        maxAge: 0, 
        path: '/',
        expires: new Date(0),
      });
    });

    // Also clear with different path variations to ensure all instances are deleted
    cookiesToDelete.forEach(cookieName => {
      cookieStore.set(cookieName, '', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        maxAge: 0, 
        path: '',
        expires: new Date(0),
      });
    });

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
 * Server Action for Token Validation
 * Validates if the current token is still valid by calling a lightweight API endpoint
 * This is called from client-side to check authentication status on page refresh
 */
export async function validateTokenAction(): Promise<{
  success: boolean;
  isValid: boolean;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    accountType?: string;
  };
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        success: true,
        isValid: false,
      };
    }

    // Try to call a lightweight endpoint to validate the token
    // Using a GET request to get current user info (this validates the token)
    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      // Fallback: if no API base URL, assume token is invalid
      return {
        success: true,
        isValid: false,
        error: 'API base URL not configured',
      };
    }

    try {
      // Try to get current user info - this validates the token
      const response = await fetch(`${apiBaseUrl}/api/v1/Auth/current-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (response.status === 401) {
        // Token is invalid or expired
        return {
          success: true,
          isValid: false,
        };
      }

      if (!response.ok) {
        // If endpoint doesn't exist, try another approach
        // For now, assume token is valid if it exists (temporary)
        return {
          success: true,
          isValid: !!token,
        };
      }

      const data = await response.json();

      return {
        success: true,
        isValid: true,
        user: data,
      };
    } catch (fetchError) {
      // If fetch fails, assume token is invalid
      logger.error('Token validation failed, assuming token is invalid');
      return {
        success: true,
        isValid: false,
      };
    }
  } catch (error) {
    logger.error('Token validation error:', error);
    return {
      success: false,
      isValid: false,
      error: 'Token validation failed',
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
    logger.log('[Server Action] volunteerOnboardingAction called');
    
    // SECURITY: Server-side sanitization
    // Convert nested structure to flat multipart/form-data format
    const sanitizedData: VolunteerOnboardingRequest = {
      'onboardingMetaData.AccountType': data['onboardingMetaData.AccountType'],
      'onboardingMetaData.CurrentPage': data['onboardingMetaData.CurrentPage'],
      'BioData.FirstName': data['BioData.FirstName'].trim(),
      'BioData.LastName': data['BioData.LastName'].trim(),
      'BioData.Gender': data['BioData.Gender'],
      'BioData.DateOfBirth': data['BioData.DateOfBirth'],
      'LocationDto.Address': data['LocationDto.Address']?.trim() || '',
      'LocationDto.City': data['LocationDto.City']?.trim() || '',
      'LocationDto.ZipCode': data['LocationDto.ZipCode']?.trim() || '',
      'LocationDto.Country': data['LocationDto.Country']?.trim() || '',
      'LocationDto.State': data['LocationDto.State']?.trim() || '',
      'Interest.Names': data['Interest.Names'] || [],
      'Skill.Names': data['Skill.Names'] || [],
      'ProfileAndBioData.Bio': data['ProfileAndBioData.Bio']?.trim() || '',
      'ProfileAndBioData.ProfileImage': data['ProfileAndBioData.ProfileImage'],
    };

    const response: ApiResponse<unknown> = await volunteerOnboarding(sanitizedData);
    logger.log('[Server Action] volunteerOnboardingAction completed');

    // Set user role cookie for volunteer
    const cookieStore = await cookies();
    cookieStore.set('user_role', 'volunteer', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    logger.log('[Server Action] volunteerOnboardingAction error:', error);
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
    logger.log('[Server Action] organizationOnboardingAction called');
    
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
    logger.log('[Server Action] organizationOnboardingAction completed');

    // Set user role cookie for organization
    const cookieStore = await cookies();
    cookieStore.set('user_role', 'organization', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    logger.log('[Server Action] organizationOnboardingAction error:', error);
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
 * GET /api/v1/countries/get-all-countries
 */
export async function getCountriesAction(): Promise<{
  success: boolean;
  data?: Country[];
  error?: string;
}> {
  try {
    logger.log('[Server Action] getCountriesAction called');
    const countries = await getCountries();
    logger.log('[Server Action] getCountriesAction completed');

    return {
      success: true,
      data: countries,
    };
  } catch (error) {
    logger.log('[Server Action] getCountriesAction error:', error);
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
 * GET /api/State/get-country-states-by-countryid?countryId={countryId}
 */
export async function getStatesAction(countryId: string): Promise<{
  success: boolean;
  data?: State[];
  error?: string;
}> {
  try {
    logger.log('[Server Action] getStatesAction called with countryId:', countryId);
    const states = await getStates(countryId);
    logger.log('[Server Action] getStatesAction completed');

    return {
      success: true,
      data: states,
    };
  } catch (error) {
    logger.log('[Server Action] getStatesAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch states',
    };
  }
}

/**
 * Server Action to Get All Causes
 * This can be called from client components but executes on the server
 * GET /api/Cause/get-all-causes
 */
export async function getCausesAction(): Promise<{
  success: boolean;
  data?: Cause[];
  error?: string;
}> {
  try {
    logger.log('[Server Action] getCausesAction called');
    const causes = await getCauses();
    logger.log('[Server Action] getCausesAction completed');

    return {
      success: true,
      data: causes,
    };
  } catch (error) {
    logger.log('[Server Action] getCausesAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch causes',
    };
  }
}

/**
 * Server Action to Get All Skills
 * This can be called from client components but executes on the server
 * GET /api/Skill/get-all-skill
 */
export async function getSkillsAction(): Promise<{
  success: boolean;
  data?: Skill[];
  error?: string;
}> {
  try {
    logger.log('[Server Action] getSkillsAction called');
    const skills = await getSkills();
    logger.log('[Server Action] getSkillsAction completed');

    return {
      success: true,
      data: skills,
    };
  } catch (error) {
    logger.log('[Server Action] getSkillsAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch skills',
    };
  }
}

/**
 * Server Action to Upload File
 * This can be called from client components but executes on the server
 * POST /api/FileUploads/file-upload
 */
export async function uploadFileAction(file: File): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  try {
    logger.log('[Server Action] uploadFileAction called');
    const fileUrl = await uploadFile(file);
    logger.log('[Server Action] uploadFileAction completed');

    return {
      success: true,
      data: fileUrl,
    };
  } catch (error) {
    logger.log('[Server Action] uploadFileAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to upload file',
    };
  }
}