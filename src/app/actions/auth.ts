'use server';

import logger from '@/lib/logger';
import {
  volunteerSignUp,
  organizationSignUp,
  verifyOtp,
  verifyTwoFactor,
  resendOtp,
  login,
  forgotPassword,
  resetForgotPassword,
  verifyForgotPasswordOtp,
  verifyResetPassword,
  volunteerOnboarding,
  organizationOnboarding,
  getCountries,
  getStates,
  getCauses,
  getInterests,
  getSkills,
  getCategories,
  uploadFile as uploadFileServer,
} from '@/lib/server-api';
import { refreshToken } from '@/lib/server-api';
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
  Interest,
  TwoFactorVerificationRequest,
  TokenRefreshRequest,
  Skill,
  CategoryApiResponse,
} from '@/types/api';
import { cookies } from 'next/headers';
import {
  sanitizeEmail,
  sanitizePassword,
  sanitizeOtp,
  isValidEmail,
} from '@/lib/sanitize';
// import logger from '@/lib/logger';

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
    // logger.log('[Server Action] volunteerSignUpAction called');
    
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
    
    // logger.log('[Server Action] volunteerSignUpAction completed');

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
    // logger.log('[Server Action] volunteerSignUpAction error:', error);
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
    // logger.log('[Server Action] organizationSignUpAction called');
    
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
    
    // logger.log('[Server Action] organizationSignUpAction completed');

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
    // logger.log('[Server Action] organizationSignUpAction error:', error);
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
    logger.log('[OTP VERIFY ACTION] Starting OTP verification');

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
    logger.log('[OTP VERIFY ACTION] OTP API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[OTP VERIFY ACTION] OTP Error:', apiError);

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to verify OTP',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for 2FA Verification
 * This can be called from client components but executes on the server
 * POST /api/v1/Auth/2fa-verify
 */
export async function verifyTwoFactorAction(data: TwoFactorVerificationRequest): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
  redirect?: string;
}> {
  try {
    logger.log('[2FA VERIFY ACTION] Starting 2FA verification');

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: TwoFactorVerificationRequest = {
      twoFactorAuthCode: sanitizeOtp(data.twoFactorAuthCode),
      email: sanitizeEmail(data.email),
    };

    if (!sanitizedData.twoFactorAuthCode || sanitizedData.twoFactorAuthCode.length !== 6) {
      return {
        success: false,
        error: 'Please enter a valid 6-digit 2FA code',
      };
    }

    if (!sanitizedData.email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    const response: ApiResponse<unknown> = await verifyTwoFactor(sanitizedData);
    logger.log('[2FA VERIFY ACTION] 2FA API Response:', response);

    // SECURITY: Store tokens in HTTP-only cookies for security
    const loginData = response.data as Record<string, unknown> | undefined;
    const cookieStore = await cookies();

    if (loginData) {
      logger.log('[2FA VERIFY ACTION] loginData keys:', Object.keys(loginData));

      // Store access token as auth_token for consistency with normal login
      if ('accessToken' in loginData && typeof loginData.accessToken === 'string') {
        cookieStore.set('auth_token', loginData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        // logger.log('[Server Action] Access token stored in cookie as auth_token');

        // Store token expiration time from API response for client-side validation
        let tokenExpiration: number | null = null;
        if ('accessTokenExpiresAt' in loginData && typeof loginData.accessTokenExpiresAt === 'string') {
          tokenExpiration = new Date(loginData.accessTokenExpiresAt).getTime();
        } else if ('accessTokenExpireMinutes' in loginData && typeof loginData.accessTokenExpireMinutes === 'string') {
          tokenExpiration = Date.now() + (parseInt(loginData.accessTokenExpireMinutes) * 60 * 1000);
        } else if ('accessTokenExpireSeconds' in loginData && typeof loginData.accessTokenExpireSeconds === 'string') {
          tokenExpiration = Date.now() + (parseInt(loginData.accessTokenExpireSeconds) * 1000);
        }

        if (tokenExpiration) {
          cookieStore.set('token_expiration', String(tokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
          // logger.log('[Server Action] Token expiration stored in cookie:', new Date(tokenExpiration).toISOString());
        }
      }

      // Store refresh token in HTTP-only cookie
      if ('refreshToken' in loginData && typeof loginData.refreshToken === 'string') {
        cookieStore.set('refresh_token', loginData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        // logger.log('[Server Action] Refresh token stored in cookie');
      }

      // Store user role in cookie (user_role for consistency)
      if ('accountType' in loginData) {
        cookieStore.set('user_role', String(loginData.accountType), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }

      // Store onboarding status (has_completed_onboarding for consistency)
      if ('hasCompletedOnboarding' in loginData) {
        cookieStore.set('has_completed_onboarding', String(loginData.hasCompletedOnboarding), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }

      // Store last completed page if available
      if ('lastCompletedPage' in loginData) {
        cookieStore.set('last_completed_page', String(loginData.lastCompletedPage), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }

      // Store email for token refresh
      if (sanitizedData.email) {
        cookieStore.set('userEmail', sanitizedData.email, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
      }

      // Clean up old cookie names for consistency
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      cookieStore.delete('accountType');
      cookieStore.delete('hasCompletedOnboarding');
      cookieStore.delete('lastCompletedPage');

      // Determine redirect based on account type
      const accountType = loginData.accountType as string | undefined;
      let redirect = '/login';

      if (accountType?.toLowerCase() === 'superadmin') {
        redirect = '/admin/dashboard';
      } else if (accountType?.toLowerCase() === 'admin') {
        redirect = '/admin/dashboard';
      } else if (accountType?.toLowerCase() === 'organization') {
        redirect = '/org/dashboard';
      } else if (accountType?.toLowerCase() === 'volunteer') {
        redirect = '/home';
      }

      logger.log('[2FA VERIFY ACTION] Redirecting to:', redirect);

      return {
        success: true,
        data: response.data,
        message: response.message,
        redirect,
      };
    }

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[2FA VERIFY ACTION] 2FA Error:', apiError);

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to verify 2FA code',
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
    logger.log('[RESEND OTP ACTION] Starting resend OTP');
    logger.log('[RESEND OTP ACTION] Input data:', data);

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedData: ResendOtpRequest = {
      email: sanitizeEmail(data.email),
      purpose: data.purpose,
      includeAlphabet: data.includeAlphabet,
      notificationType: data.notificationType,
    };
    logger.log('[RESEND OTP ACTION] Sanitized data:', sanitizedData);

    if (!isValidEmail(sanitizedData.email)) {
      logger.log('[RESEND OTP ACTION] Invalid email format');
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    logger.log('[RESEND OTP ACTION] Calling API');
    const response: ApiResponse<unknown> = await resendOtp(sanitizedData);
    logger.log('[RESEND OTP ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[RESEND OTP ACTION] API Error:', apiError);

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to resend OTP',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for Refresh Token
 * This can be called from client components but executes on the server
 * POST /api/v1/Auth/refresh-token
 */
export async function refreshTokenAction(): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
}> {
  try {
    // logger.log('[Server Action] refreshTokenAction called');

    // Read tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('auth_token')?.value || cookieStore.get('accessToken')?.value;
    const currentRefreshToken = cookieStore.get('refresh_token')?.value || cookieStore.get('refreshToken')?.value;
    const userEmail = cookieStore.get('userEmail')?.value;

    if (!accessToken || !currentRefreshToken) {
      return {
        success: false,
        error: 'No active session found. Please log in again.',
      };
    }

    if (!userEmail) {
      return {
        success: false,
        error: 'User email not found. Please log in again.',
      };
    }

    const sanitizedData: TokenRefreshRequest = {
      email: userEmail,
      accessToken: accessToken,
      refreshToken: currentRefreshToken,
    };

    const response: ApiResponse<unknown> = await refreshToken(sanitizedData);

    // logger.log('[Server Action] refreshTokenAction completed');
    // logger.log('[Server Action] Refresh Token Response Data:', JSON.stringify(response.data, null, 2));

    // SECURITY: Store new tokens in HTTP-only cookies
    const tokenData = response.data as Record<string, unknown> | undefined;

    if (tokenData) {
      // Store new access token as auth_token for consistency
      if ('accessToken' in tokenData && typeof tokenData.accessToken === 'string') {
        cookieStore.set('auth_token', tokenData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        // logger.log('[Server Action] New access token stored in cookie as auth_token');

        // Store new token expiration time from API response for client-side validation
        let tokenExpiration: number | null = null;
        if ('accessTokenExpiresAt' in tokenData && typeof tokenData.accessTokenExpiresAt === 'string') {
          tokenExpiration = new Date(tokenData.accessTokenExpiresAt).getTime();
        } else if ('accessTokenExpireMinutes' in tokenData && typeof tokenData.accessTokenExpireMinutes === 'string') {
          tokenExpiration = Date.now() + (parseInt(tokenData.accessTokenExpireMinutes) * 60 * 1000);
        } else if ('accessTokenExpireSeconds' in tokenData && typeof tokenData.accessTokenExpireSeconds === 'string') {
          tokenExpiration = Date.now() + (parseInt(tokenData.accessTokenExpireSeconds) * 1000);
        }

        if (tokenExpiration) {
          cookieStore.set('token_expiration', String(tokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
          // logger.log('[Server Action] New token expiration stored in cookie:', new Date(tokenExpiration).toISOString());
        }
      }

      // Store new refresh token
      if ('refreshToken' in tokenData && typeof tokenData.refreshToken === 'string') {
        cookieStore.set('refresh_token', tokenData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        // logger.log('[Server Action] New refresh token stored in cookie');
      }

      // Clean up old cookie names for consistency
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      cookieStore.delete('accountType');
      cookieStore.delete('hasCompletedOnboarding');
      cookieStore.delete('lastCompletedPage');
    }

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    // logger.log('[Server Action] refreshTokenAction error:', error);
    const apiError = error as ApiError;

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to refresh token',
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
  requiresTwoFactor?: boolean;
  email?: string;
}> {
  try {
    logger.log('[LOGIN ACTION] Starting login');

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
    logger.log('[LOGIN ACTION] Login API Response:', response);

    // Check if the response indicates two-factor authentication is required
    // Only require 2FA if not provided (i.e., this is the initial login attempt)
    if (!sanitizedData.twoFactorCode && response.message && response.message.toLowerCase().includes('two factor code sent')) {
      logger.log('[LOGIN ACTION] Two-factor authentication required');
      return {
        success: true,
        data: null,
        message: response.message,
        requiresTwoFactor: true,
        email: sanitizedData.email,
      };
    }

    // SECURITY: Store tokens in HTTP-only cookies for security
    const loginData = response.data as Record<string, unknown> | undefined;
    
    if (loginData) {
      // logger.log('[Server Action] loginData keys:', Object.keys(loginData));
      // logger.log('[Server Action] loginData.nameid:', loginData.nameid);
      // logger.log('[Server Action] loginData.email:', loginData.email);
      // logger.log('[Server Action] loginData.userProfile:', loginData.userProfile);
      
      // TEMPORARY WORKAROUND: Extract user data from JWT token since userProfile is null
      // This will be removed once backend fixes the userProfile field
      let userData: Record<string, unknown> | null = null;
      if ('accessToken' in loginData && typeof loginData.accessToken === 'string') {
        try {
          const tokenParts = loginData.accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            // logger.log('[Server Action] Decoded JWT payload:', payload);
            userData = {
              id: payload.nameid || payload.sub || '',
              email: payload.email || payload.unique_name || '',
              role: payload.role || '',
              firstName: payload.given_name || '',
              lastName: payload.family_name || '',
              organizationName: payload.OrganizationName || '',
              foundationId: payload.FoundationId || '',
            };
            // logger.log('[Server Action] Extracted user data from JWT:', userData);
          }
        } catch {
          // logger.error('[Server Action] Failed to decode JWT:', error);
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

        // Store token expiration time from API response for client-side validation
        // Backend provides: accessTokenExpiresAt, accessTokenExpireMinutes, or accessTokenExpireSeconds
        let tokenExpiration: number | null = null;
        if ('accessTokenExpiresAt' in loginData && typeof loginData.accessTokenExpiresAt === 'string') {
          tokenExpiration = new Date(loginData.accessTokenExpiresAt).getTime();
        } else if ('accessTokenExpireMinutes' in loginData && typeof loginData.accessTokenExpireMinutes === 'string') {
          tokenExpiration = Date.now() + (parseInt(loginData.accessTokenExpireMinutes) * 60 * 1000);
        } else if ('accessTokenExpireSeconds' in loginData && typeof loginData.accessTokenExpireSeconds === 'string') {
          tokenExpiration = Date.now() + (parseInt(loginData.accessTokenExpireSeconds) * 1000);
        }

        if (tokenExpiration) {
          cookieStore.set('token_expiration', String(tokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
          // logger.log('[Server Action] Token expiration stored in cookie:', new Date(tokenExpiration).toISOString());
        }
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
      // Handle both "organization" and "foundation" as organization accounts
      if ('accountType' in loginData && typeof loginData.accountType === 'string') {
        const accountType = loginData.accountType.toLowerCase().replace(' ', '_');
        const normalizedAccountType = accountType === 'foundation' ? 'organization' : accountType;
        cookieStore.set('user_role', normalizedAccountType, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
      }

      // Store user email for token refresh
      if (sanitizedData.email) {
        cookieStore.set('userEmail', sanitizedData.email, {
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
      
      // logger.log('[Server Action] Returning loginData with extractedUserData:', (loginData as Record<string, unknown>).extractedUserData);
      
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
    logger.log('[LOGIN ACTION] Login Error:', apiError);

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to login',
    };
  }
}

/**
 * Server Action for Forgot Password (reset password with OTP)
 * This can be called from client components but executes on the server
 */
export async function forgotPasswordAction(
  email: string,
  newPassword: string,
  confirmPassword: string,
  token: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[FORGOT PASSWORD ACTION] Starting password reset');
    logger.log('[FORGOT PASSWORD ACTION] Email:', email);
    logger.log('[FORGOT PASSWORD ACTION] Token present:', !!token);
    logger.log('[FORGOT PASSWORD ACTION] Token length:', token.length);
    logger.log('[FORGOT PASSWORD ACTION] New password length:', newPassword.length);
    logger.log('[FORGOT PASSWORD ACTION] Confirm password length:', confirmPassword.length);

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPassword = sanitizePassword(newPassword);
    const sanitizedConfirmPassword = sanitizePassword(confirmPassword);
    // The forgot password token is a long encrypted string, not a 6-digit OTP
    // We should NOT sanitize it with sanitizeOtp which limits to 6 characters
    const sanitizedToken = token.trim();

    logger.log('[FORGOT PASSWORD ACTION] Sanitized data:', {
      email: sanitizedEmail,
      passwordLength: sanitizedPassword.length,
      confirmPasswordLength: sanitizedConfirmPassword.length,
      tokenLength: sanitizedToken.length,
    });

    if (!isValidEmail(sanitizedEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    if (!sanitizedPassword) {
      return {
        success: false,
        error: 'Please enter a valid password',
      };
    }

    if (!sanitizedConfirmPassword) {
      return {
        success: false,
        error: 'Please confirm your password',
      };
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match',
      };
    }

    if (!sanitizedToken) {
      return {
        success: false,
        error: 'Invalid or missing token. Please request a new OTP.',
      };
    }

    logger.log('[FORGOT PASSWORD ACTION] Calling API');
    const response: ApiResponse<unknown> = await forgotPassword(
      sanitizedEmail,
      sanitizedPassword,
      sanitizedConfirmPassword,
      sanitizedToken
    );
    logger.log('[FORGOT PASSWORD ACTION] API Response:', response);

    return {
      success: true,
      message: (response.data as { message?: string })?.message || 'Password reset successfully',
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[FORGOT PASSWORD ACTION] API Error:', apiError);
    logger.log('[FORGOT PASSWORD ACTION] Error status:', apiError.status);
    logger.log('[FORGOT PASSWORD ACTION] Error message:', apiError.message);
    logger.log('[FORGOT PASSWORD ACTION] Error details:', JSON.stringify(apiError, null, 2));
    // Extract the actual error message from the API error
    const errorMessage = (error as { message?: string })?.message || 'Failed to reset password. Please try again.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server Action for Verify Reset Password OTP
 * This can be called from client components but executes on the server
 */
export async function verifyResetPasswordAction(
  email: string,
  newPassword: string,
  confirmPassword: string,
  token: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPassword = sanitizePassword(newPassword);
    const sanitizedConfirmPassword = sanitizePassword(confirmPassword);
    // The reset password token is a long encrypted string, not a 6-digit OTP
    // We should NOT sanitize it with sanitizeOtp which limits to 6 characters
    const sanitizedToken = token.trim();

    if (!isValidEmail(sanitizedEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    if (!sanitizedPassword) {
      return {
        success: false,
        error: 'Please enter a valid password',
      };
    }

    if (!sanitizedConfirmPassword) {
      return {
        success: false,
        error: 'Please confirm your password',
      };
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match',
      };
    }

    if (!sanitizedToken) {
      return {
        success: false,
        error: 'Invalid or missing token. Please request a new OTP.',
      };
    }

    const response: ApiResponse<unknown> = await verifyResetPassword(
      sanitizedEmail,
      sanitizedPassword,
      sanitizedConfirmPassword,
      sanitizedToken
    );

    return {
      success: true,
      message: (response.data as { message?: string })?.message || 'Password reset successfully',
    };
  } catch (error) {
    // logger.error('[VerifyResetPasswordAction] Error:', error);
    console.error('Failed to reset password:', error);
    return {
      success: false,
      error: 'Failed to reset password. Please try again.',
    };
  }
}

/**
 * Server Action for Reset Password (forgot password - send OTP)
 * This can be called from client components but executes on the server
 */
export async function resetPasswordAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[RESET PASSWORD ACTION] Starting password reset request');
    logger.log('[RESET PASSWORD ACTION] Email:', email);

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedEmail = sanitizeEmail(email);

    if (!isValidEmail(sanitizedEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const response: ApiResponse<unknown> = await resetForgotPassword(sanitizedEmail);
    logger.log('[RESET PASSWORD ACTION] API Response:', response);

    return {
      success: true,
      message: (response.data as { message?: string })?.message || 'Password reset email sent successfully',
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[RESET PASSWORD ACTION] API Error:', apiError);

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to reset password',
    };
  }
}

/**
 * Server Action for Verify Forgot Password OTP
 * Verifies the OTP sent to the user's email and returns a token
 * This token must be used in the reset password API
 */
export async function verifyForgotPasswordOtpAction(otpCode: string): Promise<{
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[OTP VERIFY ACTION] Starting OTP verification');
    logger.log('[OTP VERIFY ACTION] Input OTP:', otpCode);

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedOtp = sanitizeOtp(otpCode);
    logger.log('[OTP VERIFY ACTION] Sanitized OTP:', sanitizedOtp);

    if (!sanitizedOtp || sanitizedOtp.length !== 6) {
      logger.log('[OTP VERIFY ACTION] Invalid OTP format');
      return {
        success: false,
        error: 'Please enter a valid 6-digit OTP',
      };
    }

    logger.log('[OTP VERIFY ACTION] Calling API with sanitized OTP');
    const response: ApiResponse<unknown> = await verifyForgotPasswordOtp(sanitizedOtp);
    logger.log('[OTP VERIFY ACTION] API Response:', response);

    // Extract token from the response data
    // The API returns the token as a string with "token:" prefix or as an object
    let token: string | undefined;
    if (typeof response.data === 'string') {
      // Token is returned as a string with "token:" prefix
      token = response.data.startsWith('token:') ? response.data.substring(6) : response.data;
    } else if (response.data && typeof response.data === 'object' && 'token' in response.data) {
      // Token is returned as an object with a token property
      token = (response.data as { token: string }).token;
    }
    logger.log('[OTP VERIFY ACTION] Extracted token:', token ? 'present' : 'missing');

    return {
      success: true,
      token: token,
      message: response.message || 'OTP verified successfully',
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[OTP VERIFY ACTION] API Error:', apiError);

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to verify OTP',
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
    // NOTE: 'cookieConsent' is intentionally excluded - it's a browser-level preference
    // that should persist across login/logout cycles for legal compliance and UX
    const cookiesToDelete = [
      'auth_token',
      'access_token',
      'accessToken',
      'user_role',
      'accountType',
      'refresh_token',
      'refreshToken',
      'has_completed_onboarding',
      'hasCompletedOnboarding',
      'last_completed_page',
      'lastCompletedPage',
      'userEmail',
      'token_expiration',
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
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const tokenExpiration = cookieStore.get('token_expiration')?.value;

    if (!token) {
      return {
        success: true,
        isValid: false,
      };
    }

    // Check token expiration using stored expiration time from API response
    if (tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration, 10);
      const currentTime = Date.now();
      const bufferTime = 60 * 1000; // 1 minute buffer

      // Token is valid if current time < expiration time - buffer
      const isValid = currentTime < (expirationTime - bufferTime);

      return {
        success: true,
        isValid,
      };
    }

    // If no expiration stored, assume token is valid if it exists
    // This shouldn't happen with the new implementation, but it's a safe fallback
    return {
      success: true,
      isValid: true,
    };
  } catch (error) {
    // logger.log('[Server Action] validateTokenAction error:', error);
    console.error('Token validation error:', error);
    return {
      success: false,
      isValid: false,
      error: 'Failed to validate token',
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
    // logger.log('[Server Action] volunteerOnboardingAction called');

    // SECURITY: Server-side sanitization
    // Convert nested structure to flat multipart/form-data format
    const sanitizedData: VolunteerOnboardingRequest = {
      'onboardingMetaData.AccountType': data['onboardingMetaData.AccountType'],
      'onboardingMetaData.CurrentPage': data['onboardingMetaData.CurrentPage'],
      'BioData.FirstName': data['BioData.FirstName'].trim(),
      'BioData.LastName': data['BioData.LastName'].trim(),
      'BioData.OtherName': data['BioData.OtherName']?.trim() || undefined,
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
      'ProfileAndBioData.ImageUrl': data['ProfileAndBioData.ImageUrl'] || undefined,
    };

    const response: ApiResponse<unknown> = await volunteerOnboarding(sanitizedData);
    // logger.log('[Server Action] volunteerOnboardingAction completed');
    // logger.log('[Server Action] Onboarding response data:', JSON.stringify(response.data, null, 2));

    // Set user role cookie for volunteer
    const cookieStore = await cookies();
    cookieStore.set('user_role', 'volunteer', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Set onboarding status from API response if available
    const responseData = response.data as Record<string, unknown> | undefined;
    if (responseData && 'hasCompletedOnboarding' in responseData) {
      const hasCompletedOnboarding = responseData.hasCompletedOnboarding as boolean;
      cookieStore.set('has_completed_onboarding', String(hasCompletedOnboarding), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      // logger.log('[Server Action] Set has_completed_onboarding cookie:', hasCompletedOnboarding);
    }

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    // logger.log('[Server Action] volunteerOnboardingAction error:', error);
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
    // logger.log('[Server Action] organizationOnboardingAction called');

    // SECURITY: Server-side sanitization
    const sanitizedData: OrganizationOnboardingRequest = {
      'MetaData.AccountType': data['MetaData.AccountType'],
      'MetaData.CurrentPage': data['MetaData.CurrentPage'],
      'foundationBioData.Name': data['foundationBioData.Name'].trim(),
      'foundationBioData.FoundationCategory': data['foundationBioData.FoundationCategory'].trim(),
      'foundationBioData.Website': data['foundationBioData.Website']?.trim() || undefined,
      'foundationBioData.Mission': data['foundationBioData.Mission'].trim(),
      'FoundationLocationDto.Address': data['FoundationLocationDto.Address']?.trim() || '',
      'FoundationLocationDto.City': data['FoundationLocationDto.City']?.trim() || '',
      'FoundationLocationDto.Zipcode': data['FoundationLocationDto.Zipcode']?.trim() || '',
      'FoundationLocationDto.FoundationCountry': data['FoundationLocationDto.FoundationCountry']?.trim() || '',
      'FoundationLocationDto.FoundationState': data['FoundationLocationDto.FoundationState']?.trim() || '',
      'CauseDto.Names': data['CauseDto.Names'] || [],
      'ProfileLogo.LogoUrl': data['ProfileLogo.LogoUrl'] || undefined,
      'Disclaimer.HasAgreedToDisclaimer': data['Disclaimer.HasAgreedToDisclaimer'],
    };

    const response: ApiResponse<unknown> = await organizationOnboarding(sanitizedData);
    // logger.log('[Server Action] organizationOnboardingAction completed');
    // logger.log('[Server Action] Onboarding response data:', JSON.stringify(response.data, null, 2));

    // Set user role cookie for organization
    const cookieStore = await cookies();
    cookieStore.set('user_role', 'organization', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Set onboarding status from API response if available
    const responseData = response.data as Record<string, unknown> | undefined;
    if (responseData && 'hasCompletedOnboarding' in responseData) {
      const hasCompletedOnboarding = responseData.hasCompletedOnboarding as boolean;
      cookieStore.set('has_completed_onboarding', String(hasCompletedOnboarding), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      // logger.log('[Server Action] Set has_completed_onboarding cookie:', hasCompletedOnboarding);
    }

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    // logger.log('[Server Action] organizationOnboardingAction error:', error);
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
    // logger.log('[Server Action] getCountriesAction called');
    const countries = await getCountries();
    // logger.log('[Server Action] getCountriesAction completed');

    return {
      success: true,
      data: countries,
    };
  } catch (error) {
    // logger.log('[Server Action] getCountriesAction error:', error);
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
    // logger.log('[Server Action] getStatesAction called with countryId:', countryId);
    const states = await getStates(countryId);
    // logger.log('[Server Action] getStatesAction completed');

    return {
      success: true,
      data: states,
    };
  } catch (error) {
    // logger.log('[Server Action] getStatesAction error:', error);
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
    // logger.log('[Server Action] getCausesAction called');
    const causes = await getCauses();
    // logger.log('[Server Action] getCausesAction completed');

    return {
      success: true,
      data: causes,
    };
  } catch (error) {
    // logger.log('[Server Action] getCausesAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch causes',
    };
  }
}

/**
 * Server Action to Get All Interests
 * This can be called from client components but executes on the server
 * GET /api/Interest/get-interests
 */
export async function getInterestsAction(): Promise<{
  success: boolean;
  data?: Interest[];
  error?: string;
}> {
  try {
    // logger.log('[Server Action] getInterestsAction called');
    const interests = await getInterests();
    // logger.log('[Server Action] getInterestsAction completed');

    return {
      success: true,
      data: interests,
    };
  } catch (error) {
    // logger.log('[Server Action] getInterestsAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch interests',
    };
  }
}

/**
 * Server Action to Upload a File
 * This can be called from client components but executes on the server
 * POST /api/FileUploads/file-upload
 */
export async function uploadFileAction(file: File): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  try {
    // logger.log('[Server Action] uploadFileAction called');
    const url = await uploadFileServer(file);
    // logger.log('[Server Action] uploadFileAction completed, URL:', url);

    return {
      success: true,
      data: url,
    };
  } catch (error) {
    // logger.log('[Server Action] uploadFileAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to upload file',
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
    // logger.log('[Server Action] getSkillsAction called');
    const skills = await getSkills();
    // logger.log('[Server Action] getSkillsAction completed');

    return {
      success: true,
      data: skills,
    };
  } catch (error) {
    // logger.log('[Server Action] getSkillsAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch skills',
    };
  }
}

/**
 * Server Action to Get All Categories
 * This can be called from client components but executes on the server
 * GET /api/Category/get-all-category
 */
export async function getCategoriesAction(): Promise<{
  success: boolean;
  data?: CategoryApiResponse[];
  error?: string;
}> {
  try {
    // logger.log('[Server Action] getCategoriesAction called');
    const categories = await getCategories();
    // logger.log('[Server Action] getCategoriesAction completed');

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    // logger.log('[Server Action] getCategoriesAction error:', error);
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch categories',
    };
  }
}
