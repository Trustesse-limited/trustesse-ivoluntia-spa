import { PartialVolunteerSignUpDto, AuthInfo } from './api';

// Full volunteer signup request (all onboarding steps)
export interface FullVolunteerSignUpRequest {
  authInfo: AuthInfo;
  metaData: {
    accountType: 'volunteer';
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
}

// Full organization signup request (all onboarding steps)
export interface FullOrganizationSignUpRequest {
  foundationAdminInfo: AuthInfo;
  metaData: {
    accountType: 'organization';
    currentPage: number;
  };
  orgData: {
    name: string;
    category: string;
    website: string;
    mission: string;
    causes: string[];
    logo?: File | null;
    disclaimerAgreed: boolean;
  };
  locationDto: {
    address: string;
    city: string;
    zipCode: string;
    countryId: string;
    stateId: string;
  };
}

// Organization-specific onboarding data
export interface OrganizationOnboardingData {
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
  orgData?: {
    name?: string;
    category?: string;
    website?: string;
    mission?: string;
    causes?: string[];
    logo?: File | null;
    disclaimerAgreed?: boolean;
  };
  locationDto?: {
    userId?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    countryId?: string;
    stateId?: string;
  };
}

// Combined type for onboarding form data - includes all properties from both types
export type OnboardingFormData = PartialVolunteerSignUpDto & OrganizationOnboardingData;

// Onboarding state interface
export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  formData: OnboardingFormData;
  lastVisited: number;
  accountType: 'volunteer' | 'organization' | null;
  
  volunteerData: {
    currentStep: number;
    isComplete: boolean;
    formData: PartialVolunteerSignUpDto;
    lastVisited: number;
  };
  organizationData: {
    currentStep: number;
    isComplete: boolean;
    formData: OrganizationOnboardingData;
    lastVisited: number;
  };
  
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: OnboardingFormData) => void;
  resetOnboarding: () => void;
  clearOnboarding: () => void;
  setComplete: () => void;
  setAccountType: (type: 'volunteer' | 'organization') => void;
  checkOnboardingStatus: (type?: 'volunteer' | 'organization') => { shouldRedirect: boolean; step: number; route: string };
  canProceedToStep: (step: number) => boolean;
  switchAccountType: (type: 'volunteer' | 'organization') => void;
}