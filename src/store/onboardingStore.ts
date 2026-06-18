import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PartialVolunteerSignUpDto } from '@/types/api';

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  formData: PartialVolunteerSignUpDto;
  lastVisited: number; // timestamp of last visit
  accountType: 'volunteer' | 'organization' | null;
  
  // Separate data for each account type to prevent mixing
  volunteerData: {
    currentStep: number;
    isComplete: boolean;
    formData: PartialVolunteerSignUpDto;
    lastVisited: number;
  };
  organizationData: {
    currentStep: number;
    isComplete: boolean;
    formData: PartialVolunteerSignUpDto;
    lastVisited: number;
  };
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<PartialVolunteerSignUpDto>) => void;
  resetOnboarding: () => void;
  clearOnboarding: () => void;
  setComplete: () => void;
  setAccountType: (type: 'volunteer' | 'organization') => void;
  checkOnboardingStatus: (type?: 'volunteer' | 'organization') => { shouldRedirect: boolean; step: number; route: string };
  canProceedToStep: (step: number) => boolean;
  switchAccountType: (type: 'volunteer' | 'organization') => void;
}

const initialFormData: PartialVolunteerSignUpDto = {
  metaData: {
    accountType: 'volunteer',
    currentPage: 0,
  },
  authInfo: {
    email: '',
    password: '',
    confirmPassword: '',
    hasAcceptedTOC: false,
  },
  bioData: {
    firstName: '',
    lastName: '',
    gender: 0,
    dateOfBirth: '',
  },
  locationDto: {
    address: '',
    city: '',
    zipCode: '',
    countryId: '',
    stateId: '',
  },
  interest: {
    names: [],
  },
  skill: {
    names: [],
  },
  profileAndBioData: {
    bio: '',
    profileImageurl: '',
  },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 0, // Step 0 = signup, Steps 1-5 = onboarding screens
      totalSteps: 6, // 0 (signup) + 5 onboarding screens
      isComplete: false,
      formData: initialFormData,
      lastVisited: Date.now(),
      accountType: null,
      
      // Separate data for each account type
      volunteerData: {
        currentStep: 0,
        isComplete: false,
        formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'volunteer' } },
        lastVisited: 0,
      },
      organizationData: {
        currentStep: 0,
        isComplete: false,
        formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'organization' } },
        lastVisited: 0,
      },
      
      setCurrentStep: (step) => {
        const state = get();
        set({ 
          currentStep: step, 
          lastVisited: Date.now(),
          // Update the appropriate account type data
          ...(state.accountType === 'volunteer' ? {
            volunteerData: { ...state.volunteerData, currentStep: step, lastVisited: Date.now() }
          } : state.accountType === 'organization' ? {
            organizationData: { ...state.organizationData, currentStep: step, lastVisited: Date.now() }
          } : {})
        });
      },
      
      nextStep: () => {
        const state = get();
        const newStep = Math.min(state.currentStep + 1, state.totalSteps);
        set({
          currentStep: newStep,
          lastVisited: Date.now(),
          ...(state.accountType === 'volunteer' ? {
            volunteerData: { ...state.volunteerData, currentStep: newStep, lastVisited: Date.now() }
          } : state.accountType === 'organization' ? {
            organizationData: { ...state.organizationData, currentStep: newStep, lastVisited: Date.now() }
          } : {})
        });
      },
      
      previousStep: () => {
        const state = get();
        const newStep = Math.max(state.currentStep - 1, 0);
        set({
          currentStep: newStep,
          lastVisited: Date.now(),
          ...(state.accountType === 'volunteer' ? {
            volunteerData: { ...state.volunteerData, currentStep: newStep, lastVisited: Date.now() }
          } : state.accountType === 'organization' ? {
            organizationData: { ...state.organizationData, currentStep: newStep, lastVisited: Date.now() }
          } : {})
        });
      },
      
      updateFormData: (data) => {
        const state = get();
        const newFormData = { ...state.formData, ...data };
        set({
          formData: newFormData,
          lastVisited: Date.now(),
          ...(state.accountType === 'volunteer' ? {
            volunteerData: { ...state.volunteerData, formData: newFormData, lastVisited: Date.now() }
          } : state.accountType === 'organization' ? {
            organizationData: { ...state.organizationData, formData: newFormData, lastVisited: Date.now() }
          } : {})
        });
      },
      
      resetOnboarding: () => {
        const state = get();
        set({
          currentStep: 0,
          isComplete: false,
          formData: initialFormData,
          lastVisited: Date.now(),
          ...(state.accountType === 'volunteer' ? {
            volunteerData: {
              currentStep: 0,
              isComplete: false,
              formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'volunteer' } },
              lastVisited: Date.now(),
            }
          } : state.accountType === 'organization' ? {
            organizationData: {
              currentStep: 0,
              isComplete: false,
              formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'organization' } },
              lastVisited: Date.now(),
            }
          } : {})
        });
      },
      
      clearOnboarding: () => {
        const state = get();
        set({
          currentStep: 0,
          isComplete: false,
          formData: initialFormData,
          lastVisited: Date.now(),
          accountType: null,
          volunteerData: {
            currentStep: 0,
            isComplete: false,
            formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'volunteer' } },
            lastVisited: 0,
          },
          organizationData: {
            currentStep: 0,
            isComplete: false,
            formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'organization' } },
            lastVisited: 0,
          },
        });
      },
      
      setComplete: () => {
        const state = get();
        set({ 
          isComplete: true, 
          lastVisited: Date.now(),
          ...(state.accountType === 'volunteer' ? {
            volunteerData: { ...state.volunteerData, isComplete: true, lastVisited: Date.now() }
          } : state.accountType === 'organization' ? {
            organizationData: { ...state.organizationData, isComplete: true, lastVisited: Date.now() }
          } : {})
        });
      },
      
      setAccountType: (type) => {
        const state = get();
        // Load the data for the selected account type
        const accountData = type === 'volunteer' ? state.volunteerData : state.organizationData;
        set({
          accountType: type,
          currentStep: accountData.currentStep,
          isComplete: accountData.isComplete,
          formData: accountData.formData,
          lastVisited: Date.now(),
        });
      },
      
      switchAccountType: (type) => {
        const state = get();
        // Load the data for the selected account type
        const accountData = type === 'volunteer' ? state.volunteerData : state.organizationData;
        set({
          accountType: type,
          currentStep: accountData.currentStep,
          isComplete: accountData.isComplete,
          formData: accountData.formData,
          lastVisited: Date.now(),
        });
      },
      
      checkOnboardingStatus: (type?: 'volunteer' | 'organization') => {
        const state = get();
        const checkType = type || state.accountType;
        
        if (!checkType) {
          return { shouldRedirect: false, step: 0, route: '/' };
        }
        
        // Get data for the specific account type
        const accountData = checkType === 'volunteer' ? state.volunteerData : state.organizationData;
        
        // Only redirect if user has started onboarding (step > 0) and not completed
        const hasStartedOnboarding = accountData.currentStep > 0;
        
        // Determine the correct route based on current step and account type
        let route = '/';
        if (hasStartedOnboarding && !accountData.isComplete) {
          if (checkType === 'volunteer') {
            if (accountData.currentStep === 0) {
              route = '/onboarding/signup/volunteer';
            } else {
              route = '/onboarding/volunteer';
            }
          } else {
            if (accountData.currentStep === 0) {
              route = '/onboarding/signup/org';
            } else {
              route = '/onboarding/org';
            }
          }
        }
        
        return {
          shouldRedirect: hasStartedOnboarding && !accountData.isComplete,
          step: accountData.currentStep,
          route,
        };
      },
      
      canProceedToStep: (step) => {
        const state = get();
        const accountData = state.accountType === 'volunteer' ? state.volunteerData : state.organizationData;
        
        // User can only proceed to step if they've completed previous step
        // Step 0: No prerequisites (signup)
        // Step 1: Must have authInfo filled (signup completed)
        // Step 2+: Must have completed previous onboarding step
        if (step === 0) return true;
        if (step === 1) {
          return !!(accountData.formData.authInfo?.email && 
                   accountData.formData.authInfo?.password && 
                   accountData.formData.authInfo?.confirmPassword &&
                   accountData.formData.authInfo?.hasAcceptedTOC);
        }
        // For onboarding steps, check if current step is completed
        return accountData.currentStep >= step - 1;
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
