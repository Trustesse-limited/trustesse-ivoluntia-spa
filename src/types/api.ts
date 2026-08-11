// Generic API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
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
  authInfo: AuthInfo;
}

// Organization Sign Up Request (initial signup - foundation admin info)
// POST /api/v1/Auth/organization-signup
export interface OrganizationSignUpRequest {
  foundationAdminInfo: AuthInfo;
}

// OTP Verification Request
// POST /api/v1/Auth/verify-otp
export interface OtpVerificationRequest {
  email: string;
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
  purpose: number; // Available values: 1, 2, 3, 4, 5, 6
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
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
  requiresTwoFactor?: boolean;
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

// Volunteer Onboarding Request
export interface VolunteerOnboardingRequest {
  onboardingMetaData: {
    accountType: string;
    currentPage: number;
  };
  bioData: {
    firstName: string;
    lastName: string;
    gender: number;
    dateOfBirth: string;
  };
  locationDto: {
    address: string;
    city: string;
    zipCode: string;
    countryId: string;
    stateId: string;
  };
  interest: {
    names: string[];
  };
  skill: {
    names: string[];
  };
  profileAndBioData: {
    bio: string;
    profileImageurl?: string;
  };
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
    logo?: string;
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
  countryId: string;
  countryName: string;
  name: string;
  code?: string;
  isoCode?: string;
}

export interface State {
  id: string;
  stateId: string;
  stateName: string;
  name: string;
  countryId: string;
  code?: string;
}
