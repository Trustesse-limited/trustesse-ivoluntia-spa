// Generic API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Auth-related types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthHeaders {
  Authorization: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]> | unknown[];
}

// Pagination types
export interface PaginationParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Volunteer Sign Up DTO based on backend API
export interface VolunteerSignUpDto {
  metaData: {
    accountType: string;
    currentPage: number;
  };
  authInfo: {
    email: string;
    password: string;
    confirmPassword: string;
    hasAcceptedTOC: boolean;
  };
  bioData: {
    userId?: string;
    firstName: string;
    lastName: string;
    gender: number;
    dateOfBirth: string; // ISO 8601 format
  };
  locationDto: {
    userId?: string;
    address: string;
    city: string;
    zipCode: string;
    countryId: string;
    countryName: string;
    stateId: string;
  };
  interest: {
    userId?: string;
    names: string[];
  };
  skill: {
    userId?: string;
    names: string[];
  };
  profileAndBioData: {
    userId?: string;
    bio: string;
    profileImageurl?: string;
  };
}

// Partial version for form state management
export interface PartialVolunteerSignUpDto {
  metaData?: {
    accountType?: string;
    currentPage?: number;
  };
  authInfo?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    hasAcceptedTOC?: boolean;
  };
  bioData?: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    gender?: number;
    dateOfBirth?: string;
  };
  locationDto?: {
    userId?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    countryId?: string;
    countryName?: string;
    stateId?: string;
  };
  interest?: {
    userId?: string;
    names?: string[];
  };
  skill?: {
    userId?: string;
    names?: string[];
  };
  profileAndBioData?: {
    userId?: string;
    bio?: string;
    profileImageurl?: string;
  };
}

// Shared auth info type for signup requests
export interface AuthInfo {
  email: string;
  password: string;
  confirmPassword: string;
  hasAgreedToTermsAndCondition: boolean;
}

// Volunteer Sign Up Request (initial signup - auth info only)
// POST /api/v1/Auth/volunteer-signup
export interface VolunteerSignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  hasAgreedToTermsAndCondition: boolean;
}

// Organization Sign Up Request (initial signup - foundation admin info)
// POST /api/v1/Auth/organization-signup
export interface OrganizationSignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  hasAgreedToTermsAndCondition: boolean;
}

// OTP Verification Request
// POST /api/v1/Otp/verify-email-confirm-otp
export interface OtpVerificationRequest {
  otpCode: string;
}

// OTP Verification Response
export interface OtpVerificationResponse {
  success: boolean;
  message?: string;
  isEmailVerified?: boolean;
}

// Resend OTP Request
// POST /api/v1/Otp/resendotp
export interface ResendOtpRequest {
  email: string;
  purpose: string; // e.g., "verify-email"
  includeAlphabet: boolean;
  notificationType: string; // e.g., "email" or "sms"
}

// Login Request Model based on backend API
export interface LoginRequestModel {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
  deviceInfo?: string;
}

// Login Response
export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
  requiresTwoFactor?: boolean;
  accountType?: string;
}

// Reset Password Request
export interface ResetPasswordRequest {
  email: string;
}

// Reset Password Response
export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

// Volunteer Onboarding Request (multipart/form-data format)
export interface VolunteerOnboardingRequest {
  'onboardingMetaData.AccountType': string;
  'onboardingMetaData.CurrentPage': number;
  'BioData.FirstName': string;
  'BioData.LastName': string;
  'BioData.Gender': number;
  'BioData.DateOfBirth': string;
  'LocationDto.Address': string;
  'LocationDto.City': string;
  'LocationDto.ZipCode': string;
  'LocationDto.Country': string;
  'LocationDto.State': string;
  'Interest.Names': string[];
  'Skill.Names': string[];
  'ProfileAndBioData.Bio': string;
  'ProfileAndBioData.ProfileImage'?: File[];
}

// Organization Onboarding Request
export interface OrganizationOnboardingRequest {
  metaData: {
    accountType: string;
    currentPage: number;
  };
  foundationBioData: {
    name: string;
    foundationCategory: string;
    website?: string;
    mission: string;
  };
  foundationLocationDto: {
    address?: string;
    city: string;
    zipcode: string;
    foundationCountry: string;
    foundationState: string;
    countryId?: string;
    stateId?: string;
    userId?: string;
  };
  causeDto: {
    names: string[];
  };
  profileLogo: {
    logo?: File[];
  };
  disclaimer: {
    hasAgreedToDisclaimer: boolean;
  };
}

// Common entity types (adjust based on your actual API)
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  accountType?: 'Volunteer' | 'Organization' | 'Admin';
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  availability?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'filled';
  createdAt: string;
  updatedAt: string;
}

// Country and State types - using API response field names
export interface Country {
  id: string;
  name: string;
  countryId: string;
  countryName: string;
  code: string;
}

export interface State {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  countryId: string;
}

export interface Cause {
  causeId: string | null;
  name: string;
  description: string | null;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
}
