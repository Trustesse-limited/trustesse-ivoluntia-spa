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
  errors?: Record<string, string[]>;
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
  };
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
