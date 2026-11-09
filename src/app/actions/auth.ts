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
  verifyResetPasswordOtp,
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
  getVolunteerProfile,
  getFoundationProfile,
  createProgram,
  getPrograms,
  getProgramStats,
  getProgramById,
  updateProgram,
  deleteProgramGoal,
  deleteProgram,
  updateProgramStatus,
  joinProgram,
  leaveProgram,
  createLocation,
  addFavoriteProgram,
  getFavoritePrograms,
  removeFavoriteProgram,
  getAllFavoritePrograms,
  getOrganizations,
  getQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
} from '@/lib/server-api';
import { refreshToken } from '@/lib/server-api';
import {
  VolunteerSignUpRequest,
  OrganizationSignUpRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  VolunteerProfile,
  FoundationProfile,
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
  ProgramApiResponse,
  CreateProgramRequest,
  UpdateProgramRequest,
  UpdateProgramStatusRequest,
  CreateLocationRequest,
  Qualification,
  CreateQualificationRequest,
  UpdateQualificationRequest,
  ProgramsPagination,
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
 * Resolve an absolute token expiry timestamp (epoch ms) from an API response.
 *
 * The API is inconsistent about expiry fields:
 * - some arrive as ISO date strings even when the field name says otherwise
 *   (e.g. accessTokenExpireMinutes: '2026-10-18T19:52:05.9181223Z')
 * - some arrive as numeric strings meaning relative minutes/seconds
 * - the refresh token's absolute field is named `refreshTokenExpireDays`
 *
 * Parsing an ISO date with parseInt() yields the year (e.g. 2026), which
 * previously produced an expiry of "now + 2026 minutes" (~33h46m) instead of
 * the real access-token lifetime, so the session-expired modal never fired at
 * the actual expiry. This helper handles every shape the API has been seen to
 * return.
 */
function resolveTokenExpiration(
  data: Record<string, unknown>,
  tokenType: 'accessToken' | 'refreshToken'
): number | null {
  const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

  // Absolute expiry: an ISO date string (e.g. '2026-10-18T19:52:05.9181223Z')
  const parseAbsolute = (value: unknown): number | null => {
    if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) return null;
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? null : timestamp;
  };

  // Relative expiry: a count of minutes/seconds from now — but tolerate an
  // ISO date leaking into these fields and treat it as an absolute expiry
  const parseRelative = (value: unknown, unitMs: number): number | null => {
    if (value === undefined || value === null) return null;
    const raw = String(value);
    if (ISO_DATE_PATTERN.test(raw)) return parseAbsolute(raw);
    const amount = Number(raw);
    return Number.isFinite(amount) ? Date.now() + amount * unitMs : null;
  };

  // Absolute expiry field names per token type
  const absoluteFields =
    tokenType === 'accessToken'
      ? ['accessTokenExpiresAt']
      : ['refreshTokenExpiresAt', 'refreshTokenExpireDays'];
  for (const field of absoluteFields) {
    const timestamp = parseAbsolute(data[field]);
    if (timestamp !== null) return timestamp;
  }

  // Relative fields (names are unreliable — see note above)
  const minutes = parseRelative(data[`${tokenType}ExpireMinutes`], 60 * 1000);
  if (minutes !== null) return minutes;

  const seconds = parseRelative(data[`${tokenType}ExpireSeconds`], 1000);
  if (seconds !== null) return seconds;

  // refreshTokenExpireDays is an absolute-field name but holds a relative
  // number of days from now. Handle it here so refresh-token expiration is
  // actually stored (parseAbsolute above only matches ISO date strings).
  if (tokenType === 'refreshToken') {
    const days = parseRelative(data['refreshTokenExpireDays'], 24 * 60 * 60 * 1000);
    if (days !== null) return days;
  }

  return null;
}

/**
 * Normalize a get-programs response into items + pagination metadata.
 *
 * The swagger lists PageNumber/PageSize as query params but does not document
 * the response envelope, and the endpoint has been observed returning a bare
 * array. Handle every shape seen/likely:
 * - `data: [...]` — bare array, no pagination metadata
 * - `data: { items|data|results|programs: [...], pageNumber, pageSize,
 *            totalCount, totalPages }`
 * - pagination fields on the top-level response, next to `data`
 *
 * Field names are matched case-insensitively with common aliases so a backend
 * naming difference (totalCount vs totalRecords vs total) does not break the
 * UI. Pagination is only returned when the backend actually provides totals.
 */
function parseProgramsResponse(response: ApiResponse<unknown>): {
  programs: ProgramApiResponse[];
  pagination?: ProgramsPagination;
} {
  const pickNumber = (source: unknown, keys: string[]): number | undefined => {
    if (!source || typeof source !== 'object') return undefined;
    const record = source as Record<string, unknown>;
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'number' && Number.isFinite(value)) return value;
    }
    return undefined;
  };

  const payload = response.data;
  let programs: ProgramApiResponse[] = [];
  let container: unknown = payload;

  if (Array.isArray(payload)) {
    programs = payload as ProgramApiResponse[];
  } else if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of ['items', 'data', 'results', 'programs', 'favoritePrograms', 'favorites']) {
      if (Array.isArray(record[key])) {
        programs = record[key] as ProgramApiResponse[];
        container = record;
        break;
      }
    }
  }

  // Metadata may live on the nested container or on the top-level response
  const pageNumber =
    pickNumber(container, ['pageNumber', 'page']) ??
    pickNumber(response, ['pageNumber', 'page']) ??
    1;
  const pageSize =
    pickNumber(container, ['pageSize', 'limit']) ??
    pickNumber(response, ['pageSize', 'limit']) ??
    programs.length;
  const totalCount =
    pickNumber(container, ['totalCount', 'totalRecords', 'total']) ??
    pickNumber(response, ['totalCount', 'totalRecords', 'total']);
  const totalPages =
    pickNumber(container, ['totalPages']) ?? pickNumber(response, ['totalPages']);

  if (totalCount === undefined && totalPages === undefined) {
    // No metadata — bare array response; caller treats it as a single page
    return { programs };
  }

  const resolvedTotalPages =
    totalPages ??
    (totalCount !== undefined && pageSize > 0
      ? Math.ceil(totalCount / pageSize)
      : 1);

  return {
    programs,
    pagination: {
      pageNumber,
      pageSize,
      totalCount: totalCount ?? programs.length,
      totalPages: Math.max(resolvedTotalPages, 1),
    },
  };
}


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
        const tokenExpiration = resolveTokenExpiration(loginData, 'accessToken');

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

        // Store refresh token expiration time
        const refreshTokenExpiration = resolveTokenExpiration(loginData, 'refreshToken');

        if (refreshTokenExpiration) {
          cookieStore.set('refresh_token_expiration', String(refreshTokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          logger.log('[2FA VERIFY ACTION] Refresh token expiration stored:', new Date(refreshTokenExpiration).toISOString());
        }
      }

      // Store organization name and logo in login data for Zustand store
      if ('userProfile' in loginData && loginData.userProfile) {
        const userProfile = loginData.userProfile as Record<string, unknown>;
        const organizationName = userProfile.foundationName as string | undefined;
        const organizationLogo = userProfile.logo as string | undefined;

        if (organizationName || organizationLogo) {
          (loginData as Record<string, unknown>).organizationName = organizationName;
          (loginData as Record<string, unknown>).organizationLogo = organizationLogo;
          logger.log('[2FA VERIFY ACTION] Organization data extracted:', { organizationName, organizationLogo });
        }
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

      // Store organization name and logo in login data for Zustand store
      if ('userProfile' in loginData && loginData.userProfile) {
        const userProfile = loginData.userProfile as Record<string, unknown>;
        const organizationName = userProfile.foundationName as string | undefined;
        const organizationLogo = userProfile.logo as string | undefined;

        if (organizationName || organizationLogo) {
          (loginData as Record<string, unknown>).organizationName = organizationName;
          (loginData as Record<string, unknown>).organizationLogo = organizationLogo;
          logger.log('[2FA VERIFY ACTION] Organization data extracted:', { organizationName, organizationLogo });
        }
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

      // Store refresh token
      if ('refreshToken' in loginData && typeof loginData.refreshToken === 'string') {
        cookieStore.set('refresh_token', loginData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        // Store refresh token expiration time
        const refreshTokenExpiration = resolveTokenExpiration(loginData, 'refreshToken');

        if (refreshTokenExpiration) {
          cookieStore.set('refresh_token_expiration', String(refreshTokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          logger.log('[2FA VERIFY ACTION] Refresh token expiration stored:', new Date(refreshTokenExpiration).toISOString());
        }
      }

      // Store organization name and logo in login data for Zustand store
      if ('userProfile' in loginData && loginData.userProfile) {
        const userProfile = loginData.userProfile as Record<string, unknown>;
        const organizationName = userProfile.foundationName as string | undefined;
        const organizationLogo = userProfile.logo as string | undefined;

        if (organizationName || organizationLogo) {
          (loginData as Record<string, unknown>).organizationName = organizationName;
          (loginData as Record<string, unknown>).organizationLogo = organizationLogo;
          logger.log('[2FA VERIFY ACTION] Organization data extracted:', { organizationName, organizationLogo });
        }
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
    logger.log('[REFRESH TOKEN ACTION] Starting token refresh');

    // Read tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('auth_token')?.value || cookieStore.get('accessToken')?.value;
    const currentRefreshToken = cookieStore.get('refresh_token')?.value || cookieStore.get('refreshToken')?.value;
    const userEmail = cookieStore.get('userEmail')?.value;

    logger.log('[REFRESH TOKEN ACTION] Access token present:', !!accessToken);
    logger.log('[REFRESH TOKEN ACTION] Access token length:', accessToken?.length);
    logger.log('[REFRESH TOKEN ACTION] Refresh token present:', !!currentRefreshToken);
    logger.log('[REFRESH TOKEN ACTION] Refresh token length:', currentRefreshToken?.length);
    logger.log('[REFRESH TOKEN ACTION] User email:', userEmail);

    if (!accessToken || !currentRefreshToken) {
      logger.log('[REFRESH TOKEN ACTION] No active session found');
      return {
        success: false,
        error: 'No active session found. Please log in again.',
      };
    }

    if (!userEmail) {
      logger.log('[REFRESH TOKEN ACTION] User email not found');
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

    logger.log('[REFRESH TOKEN ACTION] Calling API');
    const response: ApiResponse<unknown> = await refreshToken(sanitizedData);
    logger.log('[REFRESH TOKEN ACTION] API Response:', response);

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
        const tokenExpiration = resolveTokenExpiration(tokenData, 'accessToken');

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

        // Store refresh token expiration time
        const refreshTokenExpiration = resolveTokenExpiration(tokenData, 'refreshToken');

        if (refreshTokenExpiration) {
          cookieStore.set('refresh_token_expiration', String(refreshTokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          logger.log('[REFRESH TOKEN ACTION] Refresh token expiration stored:', new Date(refreshTokenExpiration).toISOString());
        }
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
    const apiError = error as ApiError;
    logger.log('[REFRESH TOKEN ACTION] API Error:', apiError);
    logger.log('[REFRESH TOKEN ACTION] Error status:', apiError.status);
    logger.log('[REFRESH TOKEN ACTION] Error message:', apiError.message);
    logger.log('[REFRESH TOKEN ACTION] Error details:', JSON.stringify(apiError, null, 2));

    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to refresh token',
      errors: apiError.errors,
    };
  }
}

/**
 * Server Action for Get Volunteer Profile
 * GET /api/UserProfile/volunteer-profile
 */
export async function getVolunteerProfileAction(): Promise<{
  success: boolean;
  data?: VolunteerProfile;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[VOLUNTEER PROFILE ACTION] Starting profile fetch');

    const response = await getVolunteerProfile();
    logger.log('[VOLUNTEER PROFILE ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[VOLUNTEER PROFILE ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to fetch volunteer profile',
    };
  }
}

/**
 * Server Action for Get Foundation Profile
 * GET /api/UserProfile/foundation-profile
 */
export async function getFoundationProfileAction(): Promise<{
  success: boolean;
  data?: FoundationProfile;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[FOUNDATION PROFILE ACTION] Starting profile fetch');

    const response = await getFoundationProfile();
    logger.log('[FOUNDATION PROFILE ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[FOUNDATION PROFILE ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to fetch foundation profile',
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
        const tokenExpiration = resolveTokenExpiration(loginData, 'accessToken');

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

        // Store refresh token expiration time
        const refreshTokenExpiration = resolveTokenExpiration(loginData, 'refreshToken');

        if (refreshTokenExpiration) {
          cookieStore.set('refresh_token_expiration', String(refreshTokenExpiration), {
            httpOnly: false, // Client needs to read this
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          logger.log('[LOGIN ACTION] Refresh token expiration stored:', new Date(refreshTokenExpiration).toISOString());
        }
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

      // Store organization name and logo in login data for Zustand store
      if ('userProfile' in loginData && loginData.userProfile) {
        const userProfile = loginData.userProfile as Record<string, unknown>;
        const organizationName = userProfile.foundationName as string | undefined;
        const organizationLogo = userProfile.logo as string | undefined;

        if (organizationName || organizationLogo) {
          (loginData as Record<string, unknown>).organizationName = organizationName;
          (loginData as Record<string, unknown>).organizationLogo = organizationLogo;
          logger.log('[LOGIN ACTION] Organization data extracted:', { organizationName, organizationLogo });
        }
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
 * Server Action for Verify Reset Password OTP
 * Verifies the OTP sent to the user's email and returns a token
 * This token must be used in the reset password API
 */
export async function verifyResetPasswordOtpAction(otpCode: string): Promise<{
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[RESET PASSWORD OTP VERIFY ACTION] Starting OTP verification');
    logger.log('[RESET PASSWORD OTP VERIFY ACTION] Input OTP:', otpCode);

    // SECURITY: Server-side sanitization (authoritative layer)
    const sanitizedOtp = sanitizeOtp(otpCode);
    logger.log('[RESET PASSWORD OTP VERIFY ACTION] Sanitized OTP:', sanitizedOtp);

    if (!sanitizedOtp || sanitizedOtp.length !== 6) {
      logger.log('[RESET PASSWORD OTP VERIFY ACTION] Invalid OTP format');
      return {
        success: false,
        error: 'Please enter a valid 6-digit OTP',
      };
    }

    logger.log('[RESET PASSWORD OTP VERIFY ACTION] Calling API with sanitized OTP');
    const response: ApiResponse<unknown> = await verifyResetPasswordOtp(sanitizedOtp);
    logger.log('[RESET PASSWORD OTP VERIFY ACTION] API Response:', response);

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
    logger.log('[RESET PASSWORD OTP VERIFY ACTION] Extracted token:', token ? 'present' : 'missing');

    return {
      success: true,
      token: token,
      message: response.message || 'OTP verified successfully',
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[RESET PASSWORD OTP VERIFY ACTION] API Error:', apiError);

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
      'refresh_token_expiration',
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
 * Validates whether the current session is still valid by combining:
 * 1. a local clock check against the token_expiration cookie, and
 * 2. a lightweight authenticated backend probe, so that server-side
 *    invalidation (backend restarts / Data Protection key-ring rotation,
 *    token revocation, early expiry) also triggers the session-expired modal
 * This is called from client-side on page load and periodically
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

    // 1) Local clock check (fast path) using the expiry recorded at login,
    //    with a 1-minute buffer
    if (tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration, 10);
      const bufferTime = 60 * 1000; // 1 minute buffer

      if (!Number.isNaN(expirationTime) && Date.now() >= expirationTime - bufferTime) {
        return {
          success: true,
          isValid: false,
        };
      }
    }

    // 2) Real backend probe — the cookie clock cannot see server-side
    //    invalidation, which is exactly when the session dies "early"
    const role = (cookieStore.get('user_role')?.value || '').toLowerCase();
    let probe: Promise<unknown> | null = null;
    if (role === 'organization' || role === 'foundation') {
      probe = getFoundationProfile();
    } else if (role === 'volunteer') {
      probe = getVolunteerProfile();
    }

    if (probe) {
      try {
        await probe;
      } catch (probeError) {
        const apiError = probeError as ApiError;
        const message = apiError.message || '';
        const isAuthFailure =
          apiError.status === 401 ||
          message.includes('Authentication failed') ||
          // ASP.NET Data Protection key-ring failure: the token can no longer
          // be decrypted by the backend — only a fresh login fixes this
          message.includes('key ring') ||
          message.includes('DataProtection') ||
          message.includes('was not found in the key');

        if (isAuthFailure) {
          return {
            success: true,
            isValid: false,
          };
        }
        // 404 (authenticated but no record), 5xx and network/timeouts are NOT
        // session failures — never log the user out over a backend blip;
        // the next scheduled check will retry.
      }
    }

    // Token exists, is within its expiry window, and the backend still
    // accepts it (or is unreachable right now — benefit of the doubt)
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
 * Server Action to Get All Qualifications
 * This can be called from client components but executes on the server
 * GET /api/Qualification
 */
export async function getQualificationsAction(): Promise<{
  success: boolean;
  data?: Qualification[];
  error?: string;
}> {
  try {
    const qualifications = await getQualifications();

    return {
      success: true,
      data: qualifications,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to fetch qualifications',
    };
  }
}

/**
 * Server Action to Create Qualification
 * This can be called from client components but executes on the server
 * POST /api/Qualification/creation
 */
export async function createQualificationAction(data: CreateQualificationRequest): Promise<{
  success: boolean;
  data?: Qualification;
  error?: string;
}> {
  try {
    const qualification = await createQualification(data);

    return {
      success: true,
      data: qualification.data,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to create qualification',
    };
  }
}

/**
 * Server Action to Update Qualification
 * This can be called from client components but executes on the server
 * PUT /api/Qualification/{qualificationId}
 */
export async function updateQualificationAction(
  qualificationId: string,
  data: UpdateQualificationRequest
): Promise<{
  success: boolean;
  data?: Qualification;
  error?: string;
}> {
  try {
    const qualification = await updateQualification(qualificationId, data);

    return {
      success: true,
      data: qualification.data,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to update qualification',
    };
  }
}

/**
 * Server Action to Delete Qualification
 * This can be called from client components but executes on the server
 * DELETE /api/Qualification/{qualificationId}
 */
export async function deleteQualificationAction(qualificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await deleteQualification(qualificationId);

    return {
      success: true,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message || 'Failed to delete qualification',
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

/**
 * Server Action for Create Program
 * POST /api/Programs/create
 */
export async function createProgramAction(request: CreateProgramRequest): Promise<{
  success: boolean;
  data?: ProgramApiResponse;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[CREATE PROGRAM ACTION] Starting program creation');
    logger.log('[CREATE PROGRAM ACTION] Request:', request);

    const response = await createProgram(request);
    logger.log('[CREATE PROGRAM ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[CREATE PROGRAM ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to create program',
    };
  }
}

/**
 * Server Action for Get Programs
 * GET /api/Programs/get-programs
 *
 * Supports the full query surface of the endpoint: search, dateRange,
 * foundationId, status and PageNumber/PageSize pagination. Items are returned
 * in `data` (unchanged — existing callers keep working) plus normalized
 * `pagination` metadata when the backend provides it.
 */
export async function getProgramsAction(params?: {
  foundationId?: string;
  status?: string;
  search?: string;
  dateRange?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<{
  success: boolean;
  data?: ProgramApiResponse[];
  pagination?: ProgramsPagination;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[GET PROGRAMS ACTION] Starting programs fetch');
    logger.log('[GET PROGRAMS ACTION] Params:', params);

    // Map camelCase action params to the swagger query names
    const query: {
      PageNumber?: number;
      PageSize?: number;
      foundationId?: string;
      status?: string;
      search?: string;
      dateRange?: string;
    } = {};
    if (params?.foundationId) query.foundationId = params.foundationId;
    if (params?.status) query.status = params.status;
    if (params?.search) query.search = params.search;
    if (params?.dateRange) query.dateRange = params.dateRange;
    if (params?.pageNumber) query.PageNumber = params.pageNumber;
    if (params?.pageSize) query.PageSize = params.pageSize;

    const response = await getPrograms(
      Object.keys(query).length > 0 ? query : undefined
    );
    logger.log('[GET PROGRAMS ACTION] API Response:', JSON.stringify(response, null, 2));

    const parsed = parseProgramsResponse(response);

    return {
      success: true,
      data: parsed.programs,
      pagination: parsed.pagination,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[GET PROGRAMS ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to fetch programs',
    };
  }
}

/**
 * Server Action for Get Organizations
 * GET /api/Organization/get
 *
 * Fetches organizations for use as filter options in admin program management.
 */
export async function getOrganizationsAction(params?: {
  Page?: number;
  PageSize?: number;
  Status?: string;
  All?: boolean;
  SearchQuery?: string;
  OrderByColumn?: string;
  OrderBy?: string;
}): Promise<{
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[GET ORGANIZATIONS ACTION] Starting organizations fetch');
    logger.log('[GET ORGANIZATIONS ACTION] Params:', params);

    const response = await getOrganizations(params);
    logger.log('[GET ORGANIZATIONS ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[GET ORGANIZATIONS ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to fetch organizations',
    };
  }
}

/**
 * Server Action for Get Program Stats
 * GET /api/Programs/get-program-stats
 */
export async function getProgramStatsAction(foundationId: string): Promise<{
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[GET PROGRAM STATS ACTION] Starting stats fetch');
    logger.log('[GET PROGRAM STATS ACTION] Foundation ID:', foundationId);

    const response = await getProgramStats(foundationId);
    logger.log('[GET PROGRAM STATS ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[GET PROGRAM STATS ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to fetch program stats',
    };
  }
}

/**
 * Server Action for Get Program By ID
 * GET /api/Programs/get-program-by-id
 */
export async function getProgramByIdAction(id: string): Promise<{
  success: boolean;
  data?: ProgramApiResponse;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[GET PROGRAM BY ID ACTION] Starting program fetch');
    logger.log('[GET PROGRAM BY ID ACTION] Program ID:', id);

    const response = await getProgramById(id);
    logger.log('[GET PROGRAM BY ID ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[GET PROGRAM BY ID ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to fetch program',
    };
  }
}

/**
 * Server Action for Update Program
 * PUT /api/Programs/update
 */
export async function updateProgramAction(request: UpdateProgramRequest): Promise<{
  success: boolean;
  data?: ProgramApiResponse;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[UPDATE PROGRAM ACTION] Starting program update');
    logger.log('[UPDATE PROGRAM ACTION] Request:', request);

    const response = await updateProgram(request);
    logger.log('[UPDATE PROGRAM ACTION] API Response:', response);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[UPDATE PROGRAM ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to update program',
    };
  }
}

/**
 * Server Action for Delete Program Goal
 * DELETE /api/Programs/delete-program-goal
 */
export async function deleteProgramGoalAction(programGoalId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[DELETE PROGRAM GOAL ACTION] Starting goal deletion');
    logger.log('[DELETE PROGRAM GOAL ACTION] Program Goal ID:', programGoalId);

    const response = await deleteProgramGoal(programGoalId);
    logger.log('[DELETE PROGRAM GOAL ACTION] API Response:', response);

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[DELETE PROGRAM GOAL ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to delete program goal',
    };
  }
}

/**
 * Server Action for Delete Program
 * DELETE /api/Programs/delete-program
 */
export async function deleteProgramAction(programId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[DELETE PROGRAM ACTION] Starting program deletion');
    logger.log('[DELETE PROGRAM ACTION] Program ID:', programId);

    const response = await deleteProgram(programId);
    logger.log('[DELETE PROGRAM ACTION] API Response:', response);

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[DELETE PROGRAM ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to delete program',
    };
  }
}

/**
 * Server Action for Update Program Status
 * PUT /api/Programs/updateprogramstatus
 */
export async function updateProgramStatusAction(request: UpdateProgramStatusRequest): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[UPDATE PROGRAM STATUS ACTION] Starting status update');
    logger.log('[UPDATE PROGRAM STATUS ACTION] Request:', request);

    const response = await updateProgramStatus(request);
    logger.log('[UPDATE PROGRAM STATUS ACTION] API Response:', response);

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[UPDATE PROGRAM STATUS ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to update program status',
    };
  }
}

/**
 * Server Action for Join Program
 * POST /api/Programs/join-program
 */
export async function joinProgramAction(programId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[JOIN PROGRAM ACTION] Starting program join');
    logger.log('[JOIN PROGRAM ACTION] Program ID:', programId);

    const response = await joinProgram(programId);
    logger.log('[JOIN PROGRAM ACTION] API Response:', response);

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[JOIN PROGRAM ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to join program',
    };
  }
}

/**
 * Server Action for Leave Program
 * POST /api/Programs/leave-program
 */
export async function leaveProgramAction(programId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[LEAVE PROGRAM ACTION] Starting program leave');
    logger.log('[LEAVE PROGRAM ACTION] Program ID:', programId);

    const response = await leaveProgram(programId);
    logger.log('[LEAVE PROGRAM ACTION] API Response:', response);

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[LEAVE PROGRAM ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to leave program',
    };
  }
}

/**
 * Normalize a FavoritePrograms payload into plain program objects.
 *
 * The response shape is undocumented; rows may be the program objects
 * themselves or wrapper rows like `{ programId, program: {...} }`. Unwrap
 * defensively so callers always receive items with a usable `id`.
 */
function normalizeFavoritePrograms(payload: unknown): ProgramApiResponse[] {
  let list: unknown[] = [];
  if (Array.isArray(payload)) {
    list = payload;
  } else if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of ['items', 'data', 'results', 'programs', 'favoritePrograms', 'favorites']) {
      if (Array.isArray(record[key])) {
        list = record[key] as unknown[];
        break;
      }
    }
  }

  const normalized: ProgramApiResponse[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') continue;
    const row = entry as Record<string, unknown>;
    // Wrapper row: the program lives on a nested `program` field
    const nested =
      row.program && typeof row.program === 'object'
        ? (row.program as Record<string, unknown>)
        : row;
    const id =
      (typeof nested.id === 'string' && nested.id) ||
      (typeof nested.programId === 'string' && nested.programId) ||
      (typeof row.programId === 'string' && row.programId) ||
      '';
    if (!id) continue;
    normalized.push({ ...(nested as unknown as ProgramApiResponse), id });
  }
  return normalized;
}

/**
 * Server Action for Add Favorite Program
 * POST /api/FavoritePrograms/add-favorite-program
 */
export async function addFavoriteProgramAction(programId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[ADD FAVORITE ACTION] Program ID:', programId);

    const response = await addFavoriteProgram(programId);
    logger.log('[ADD FAVORITE ACTION] API Response:', response);

    return { success: true, message: response.message };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[ADD FAVORITE ACTION] API Error:', apiError);

    return { success: false, error: apiError.message || 'Failed to add favourite' };
  }
}

/**
 * Server Action for Remove Favorite Program
 * DELETE /api/FavoritePrograms/remove-favorite-program
 */
export async function removeFavoriteProgramAction(programId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[REMOVE FAVORITE ACTION] Program ID:', programId);

    const response = await removeFavoriteProgram(programId);
    logger.log('[REMOVE FAVORITE ACTION] API Response:', response);

    return { success: true, message: response.message };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[REMOVE FAVORITE ACTION] API Error:', apiError);

    return { success: false, error: apiError.message || 'Failed to remove favourite' };
  }
}

/**
 * Server Action for Get Favorite Programs (current user's favourites)
 * GET /api/FavoritePrograms/get-favorite-programs
 */
export async function getFavoriteProgramsAction(): Promise<{
  success: boolean;
  data?: ProgramApiResponse[];
  message?: string;
  error?: string;
}> {
  try {
    const response = await getFavoritePrograms();
    logger.log('[GET FAVORITES ACTION] API Response:', response);

    return {
      success: true,
      data: normalizeFavoritePrograms(response.data),
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[GET FAVORITES ACTION] API Error:', apiError);

    return { success: false, error: apiError.message || 'Failed to fetch favourites' };
  }
}

/**
 * Server Action for Get All Favorite Programs (paginated)
 * GET /api/FavoritePrograms/get-all-favorite-programs
 */
export async function getAllFavoriteProgramsAction(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<{
  success: boolean;
  data?: ProgramApiResponse[];
  pagination?: ProgramsPagination;
  message?: string;
  error?: string;
}> {
  try {
    // Map camelCase action params to the swagger query names
    const query: { PageNumber?: number; PageSize?: number } = {};
    if (params?.pageNumber) query.PageNumber = params.pageNumber;
    if (params?.pageSize) query.PageSize = params.pageSize;

    const response = await getAllFavoritePrograms(
      Object.keys(query).length > 0 ? query : undefined
    );
    logger.log('[GET ALL FAVORITES ACTION] API Response:', response);

    const parsed = parseProgramsResponse(response);

    return {
      success: true,
      data: normalizeFavoritePrograms(parsed.programs),
      pagination: parsed.pagination,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[GET ALL FAVORITES ACTION] API Error:', apiError);

    return { success: false, error: apiError.message || 'Failed to fetch favourites' };
  }
}

/**
 * Server Action for Create Location
 * POST /api/Location/create-location
 */
export async function createLocationAction(request: CreateLocationRequest): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    logger.log('[CREATE LOCATION ACTION] Starting location creation');
    logger.log('[CREATE LOCATION ACTION] Request:', request);

    const response = await createLocation(request);
    logger.log('[CREATE LOCATION ACTION] API Response:', response);

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('[CREATE LOCATION ACTION] API Error:', apiError);

    return {
      success: false,
      error: apiError.message || 'Failed to create location',
    };
  }
}
