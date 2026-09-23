/**
 * API Configuration and Version Management
 * 
 * This file centralizes all API configuration including:
 * - Base URL configuration
 * - API version management
 * - Endpoint path builders
 * 
 * To change the API version, simply update the API_VERSION constant.
 * All endpoints will automatically use the new version.
 */

// API Version Configuration
export const API_VERSION = 'v1';

// API Base Configuration
export const API_CONFIG = {
  // Base URL for the API (from environment variable or default)
  baseURL: process.env.API_BASE_URL || 'https://trustessevolt-001-site3.ctempurl.com',
  
  // Current API version
  version: API_VERSION,
  
  // API prefix pattern
  apiPrefix: 'api',
} as const;

/**
 * Build a versioned API endpoint URL
 * @param endpoint - The endpoint path (e.g., 'Auth/login', 'countries/get-all-countries')
 * @param useVersion - Whether to include the version prefix (default: true)
 * @returns The full API endpoint path
 */
export function buildApiEndpoint(endpoint: string, useVersion: boolean = true): string {
  if (useVersion) {
    return `/api/${API_VERSION}/${endpoint}`;
  }
  return `/api/${endpoint}`;
}

/**
 * Build a versioned API endpoint URL for endpoints that don't use versioning
 * @param endpoint - The endpoint path (e.g., 'Cause/get-all-causes')
 * @returns The full API endpoint path without version
 */
export function buildApiEndpointNoVersion(endpoint: string): string {
  return `/api/${endpoint}`;
}

/**
 * API Endpoint Categories
 * Organized by the swagger documentation categories
 */
export const API_ENDPOINTS = {
  // Auth endpoints (versioned)
  auth: {
    login: buildApiEndpoint('Auth/login'),
    volunteerSignup: buildApiEndpoint('Auth/volunteer-signup'),
    organizationSignup: buildApiEndpoint('Auth/organization-signup'),
    resetPassword: buildApiEndpoint('Auth/resetpassword'),
    changePassword: buildApiEndpoint('Auth/changepassword'),
    forgotPassword: buildApiEndpoint('Auth/forgotpassword'),
    twoFactorSetup: buildApiEndpoint('Auth/2fa-setup'),
    twoFactorVerify: buildApiEndpoint('Auth/2fa-verify'),
    refreshToken: buildApiEndpoint('Auth/refresh-token'),
  },

  // Cause endpoints (non-versioned)
  cause: {
    create: buildApiEndpointNoVersion('Cause/create-cause'),
    getAll: buildApiEndpointNoVersion('Cause/get-all-causes'),
    getById: buildApiEndpointNoVersion('Cause/get-cause-by-id'),
    delete: buildApiEndpointNoVersion('Cause/delete-cause-by-id'),
  },

  // Country endpoints (versioned)
  countries: {
    create: buildApiEndpoint('countries/create-country'),
    getById: buildApiEndpoint('countries/get-country-by-id'),
    getAll: buildApiEndpoint('countries/get-all-countries'),
    delete: buildApiEndpoint('countries/delete-country-by-id'),
  },

  // Donation endpoints (non-versioned)
  donation: {
    donate: buildApiEndpointNoVersion('Donation/donate'),
    update: buildApiEndpointNoVersion('Donation/update'),
  },

  // Favorite Programs endpoints (non-versioned)
  favoritePrograms: {
    add: buildApiEndpointNoVersion('FavoritePrograms/add-favorite-program'),
    get: buildApiEndpointNoVersion('FavoritePrograms/get-favorite-programs'),
    remove: buildApiEndpointNoVersion('FavoritePrograms/remove-favorite-program'),
    getAll: buildApiEndpointNoVersion('FavoritePrograms/get-all-favorite-programs'),
  },

  // File Upload endpoints (non-versioned)
  fileUploads: {
    uploads: buildApiEndpointNoVersion('FileUploads/file-uploads'),
    upload: buildApiEndpointNoVersion('FileUploads/file-upload'),
  },

  // Home endpoint (non-versioned)
  home: {
    get: buildApiEndpointNoVersion('Home'),
  },

  // Interest endpoints (non-versioned)
  interest: {
    create: buildApiEndpointNoVersion('Interest/create-interest'),
    getAll: buildApiEndpointNoVersion('Interest/get-interests'),
    getById: buildApiEndpointNoVersion('Interest/get-interest-by-id'),
    delete: buildApiEndpointNoVersion('Interest/delete-interest-by-id'),
  },

  // Notifications endpoint (non-versioned)
  notifications: {
    compose: buildApiEndpointNoVersion('Notifications/compose'),
  },

  // Onboarding endpoints (versioned)
  onboarding: {
    volunteer: buildApiEndpoint('Onboarding/volunteer-onboarding'),
    organization: buildApiEndpoint('Onboarding/organization-onboarding'),
  },

  // Organization endpoints (mixed)
  organization: {
    get: buildApiEndpointNoVersion('Organization/get'),
    getById: buildApiEndpointNoVersion('Organization/get-by-id'),
    updateStatus: (id: string) => `/organizations/${id}/status`,
    accountDetails: buildApiEndpointNoVersion('organisations/account-details'),
  },

  // OTP endpoints (versioned)
  otp: {
    generate: buildApiEndpoint('Otp/generate-otp'),
    confirm: buildApiEndpoint('Otp/confirm-otp'),
    resend: buildApiEndpoint('Otp/resendotp'),
    verifyEmail: buildApiEndpoint('Otp/verify-email-confirm-otp'),
    verifyResetPassword: buildApiEndpoint('Otp/verify-reset-password-otp'),
  },

  // Programs endpoints (non-versioned)
  programs: {
    create: buildApiEndpointNoVersion('Programs/create'),
    getAll: buildApiEndpointNoVersion('Programs/get-programs'),
    getById: (id: string) => buildApiEndpointNoVersion(`Programs/get-program-by-id?id=${id}`),
    update: buildApiEndpointNoVersion('Programs/update'),
    deleteGoal: buildApiEndpointNoVersion('Programs/delete-program-goal'),
    updateStatus: buildApiEndpointNoVersion('Programs/updateprogramstatus'),
    join: buildApiEndpointNoVersion('Programs/join-program'),
    leave: buildApiEndpointNoVersion('Programs/leave-program'),
  },

  // Qualification endpoints (non-versioned)
  qualification: {
    create: buildApiEndpointNoVersion('Qualification/creation'),
    update: (id: string) => buildApiEndpointNoVersion(`Qualification/${id}`),
    getById: (id: string) => buildApiEndpointNoVersion(`Qualification/${id}`),
    delete: (id: string) => buildApiEndpointNoVersion(`Qualification/${id}`),
    getAll: buildApiEndpointNoVersion('Qualification'),
  },

  // Security Questions endpoints (non-versioned)
  securityQuestions: {
    create: buildApiEndpointNoVersion('SecurityQuestions/security-questions'),
    getAll: buildApiEndpointNoVersion('SecurityQuestions/security-questions'),
    delete: (id: string) => buildApiEndpointNoVersion(`SecurityQuestions/security-questions/${id}`),
    userSetup: buildApiEndpointNoVersion('SecurityQuestions/users/security-questions/setup'),
    userValidate: buildApiEndpointNoVersion('SecurityQuestions/users/security-questions/validate'),
    userResetRequest: buildApiEndpointNoVersion('SecurityQuestions/users/security-questions/reset-request'),
    userReset: buildApiEndpointNoVersion('SecurityQuestions/users/security-questions/reset'),
  },

  // Skill endpoints (non-versioned)
  skill: {
    create: buildApiEndpointNoVersion('Skill/create-skill'),
    getAll: buildApiEndpointNoVersion('Skill/get-all-skill'),
    getById: buildApiEndpointNoVersion('Skill/get-skill-by-id'),
    delete: buildApiEndpointNoVersion('Skill/delete-skill-by-id'),
  },

  // State endpoints (non-versioned)
  state: {
    create: buildApiEndpointNoVersion('State/create-state'),
    getByCountry: buildApiEndpointNoVersion('State/get-country-states-by-countryid'),
    getById: buildApiEndpointNoVersion('State/get-state-by-id'),
    delete: buildApiEndpointNoVersion('State/delete-state'),
  },

  // Transaction Pin endpoints (non-versioned)
  transactionPin: {
    setup: buildApiEndpointNoVersion('TransactionPin/setup-pin'),
    verify: buildApiEndpointNoVersion('TransactionPin/pin-verification'),
  },

  // User Qualification endpoints (non-versioned)
  userQualification: {
    create: buildApiEndpointNoVersion('user-qualifications'),
    delete: (id: string) => buildApiEndpointNoVersion(`user-qualifications/${id}`),
  },

  // Volunteers endpoints (non-versioned)
  volunteers: {
    getByFoundation: buildApiEndpointNoVersion('Volunteers/get-volunteer-by-foundation-id'),
  },
} as const;

/**
 * Helper function to check if an endpoint should use versioning
 * Based on the swagger documentation pattern
 */
export function shouldUseVersion(endpoint: string): boolean {
  // Endpoints that start with /api/v1 use versioning
  const versionedPatterns = [
    'Auth',
    'countries',
    'Onboarding',
    'Otp',
  ];
  
  return versionedPatterns.some(pattern => endpoint.startsWith(pattern));
}

/**
 * Get the correct endpoint path based on whether it needs versioning
 * @param endpoint - The endpoint path
 * @returns The full endpoint path with or without version
 */
export function getEndpointPath(endpoint: string): string {
  if (shouldUseVersion(endpoint)) {
    return buildApiEndpoint(endpoint);
  }
  return buildApiEndpointNoVersion(endpoint);
}
