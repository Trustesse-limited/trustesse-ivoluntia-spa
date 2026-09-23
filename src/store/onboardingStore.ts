import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PartialVolunteerSignUpDto } from '@/types/api';
import { OnboardingState, OnboardingFormData, OrganizationOnboardingData } from '@/types/onboarding';
import logger from '@/lib/logger';

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
    otherName: '',
    gender: 0,
    dateOfBirth: '',
  },
  locationDto: {
    address: '',
    city: '',
    zipCode: '',
    countryId: '',
    countryName: '',
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

const initialOrgData: OrganizationOnboardingData = {
  metaData: {
    accountType: 'organization',
    currentPage: 0,
  },
  authInfo: {
    email: '',
    password: '',
    confirmPassword: '',
    hasAcceptedTOC: false,
  },
  orgData: {
    name: '',
    category: '',
    website: '',
    mission: '',
    causes: [],
    logo: null,
    disclaimerAgreed: false,
  },
  locationDto: {
    address: '',
    city: '',
    zipCode: '',
    countryId: '',
    countryName: '',
    stateId: '',
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
      currentUserEmail: null,
      
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
        formData: { ...initialOrgData, metaData: { ...initialOrgData.metaData, accountType: 'organization' } },
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
      
      updateFormData: (data: OnboardingFormData) => {
        const state = get();
        
        // SECURITY: Sanitize data to remove password fields before storing
        const sanitizedData = { ...data };
        if (sanitizedData.authInfo) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, confirmPassword, ...secureAuthInfo } = sanitizedData.authInfo;
          sanitizedData.authInfo = secureAuthInfo;
          
          // Store the email if available
          if (secureAuthInfo.email && !state.currentUserEmail) {
            set({ currentUserEmail: secureAuthInfo.email });
          }
        }
        
        const newFormData = { ...state.formData, ...sanitizedData };
        set({
          formData: newFormData,
          lastVisited: Date.now(),
          ...(state.accountType === 'volunteer' ? {
            volunteerData: { ...state.volunteerData, formData: newFormData as PartialVolunteerSignUpDto, lastVisited: Date.now() }
          } : state.accountType === 'organization' ? {
            organizationData: { ...state.organizationData, formData: newFormData as OrganizationOnboardingData, lastVisited: Date.now() }
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
              formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'volunteer' }, bioData: { ...initialFormData.bioData, otherName: '' } },
              lastVisited: Date.now(),
            }
          } : state.accountType === 'organization' ? {
            organizationData: {
              currentStep: 0,
              isComplete: false,
              formData: { ...initialOrgData, metaData: { ...initialOrgData.metaData, accountType: 'organization' } },
              lastVisited: Date.now(),
            }
          } : {})
        });
      },
      
      clearOnboarding: (email?: string) => {
        const state = get();
        // Only clear if the email is different from the stored email
        if (email && state.currentUserEmail === email) {
          logger.log('[Onboarding] Same user logged in, preserving onboarding data');
          return;
        }
        
        logger.log('[Onboarding] Different user or no email, clearing onboarding data');
        set({
          currentStep: 0,
          isComplete: false,
          formData: initialFormData,
          lastVisited: Date.now(),
          accountType: null,
          currentUserEmail: email || null,
          volunteerData: {
            currentStep: 0,
            isComplete: false,
            formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'volunteer' }, bioData: { ...initialFormData.bioData, otherName: '' } },
            lastVisited: Date.now(),
          },
          organizationData: {
            currentStep: 0,
            isComplete: false,
            formData: { ...initialOrgData, metaData: { ...initialOrgData.metaData, accountType: 'organization' } },
            lastVisited: Date.now(),
          },
        });
        // Clear localStorage to prevent persist middleware from restoring old data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboarding-storage');
        }
      },

      clearAllOnboarding: () => {
        logger.log('[Onboarding] Force clearing all onboarding data');
        set({
          currentStep: 0,
          isComplete: false,
          formData: initialFormData,
          lastVisited: Date.now(),
          accountType: null,
          currentUserEmail: null,
          volunteerData: {
            currentStep: 0,
            isComplete: false,
            formData: { ...initialFormData, metaData: { ...initialFormData.metaData, accountType: 'volunteer' }, bioData: { ...initialFormData.bioData, otherName: '' } },
            lastVisited: 0,
          },
          organizationData: {
            currentStep: 0,
            isComplete: false,
            formData: { ...initialOrgData, metaData: { ...initialOrgData.metaData, accountType: 'organization' } },
            lastVisited: 0,
          },
        });
        // Clear persisted storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboarding-storage');
        }
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

      initializeFromLoginResponse: (loginResponse) => {
        // Handle both "organization" and "foundation" as organization accounts
        const accountType = (() => {
          const type = loginResponse.accountType?.toLowerCase();
          if (type === 'foundation' || type === 'organization') {
            return 'organization';
          }
          return 'volunteer';
        })();
        const lastCompletedPage = loginResponse.lastCompletedPage || 0;
        const hasCompletedOnboarding = loginResponse.hasCompletedOnboarding || false;
        const userProfile = loginResponse.userProfile || {};

        logger.log('[Onboarding] Initializing from login response:', {
          accountType,
          lastCompletedPage,
          hasCompletedOnboarding,
          userProfile: !!userProfile,
        });

        if (accountType === 'volunteer') {
          // Update volunteer data with login response
          // Handle gender conversion from both string and number formats
          const genderValue = userProfile.gender;
          const genderNum = genderValue ? (typeof genderValue === 'string' ? parseInt(genderValue, 10) : genderValue) : 0;
          
          logger.log('[Onboarding] Gender conversion - genderValue:', genderValue, 'genderNum:', genderNum);
          
          // Format date of birth to YYYY-MM-DD for date input
          let formattedDob = userProfile.dateOfBirth || '';
          if (formattedDob && formattedDob.includes('T')) {
            formattedDob = formattedDob.split('T')[0];
          }
          
          const volunteerFormData: PartialVolunteerSignUpDto = {
            metaData: {
              accountType: 'volunteer',
              currentPage: lastCompletedPage,
            },
            bioData: {
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || '',
              otherName: userProfile.otherName || '',
              gender: genderNum,
              dateOfBirth: formattedDob,
            },
            locationDto: {
              address: userProfile.address || '',
              city: userProfile.city || '',
              zipCode: userProfile.zipCode || '',
              countryId: userProfile.country || '',
              countryName: userProfile.countryName || '',
              stateId: userProfile.state || '',
            },
            interest: {
              names: userProfile.interestNames || [],
            },
            skill: {
              names: userProfile.skillNames || [],
            },
            profileAndBioData: {
              bio: userProfile.bio || '',
              profileImageurl: userProfile.profileImage || '',
            },
          };

          set({
            accountType: 'volunteer',
            currentStep: lastCompletedPage,
            isComplete: hasCompletedOnboarding,
            formData: volunteerFormData,
            volunteerData: {
              currentStep: lastCompletedPage,
              isComplete: hasCompletedOnboarding,
              formData: volunteerFormData,
              lastVisited: Date.now(),
            },
            lastVisited: Date.now(),
          });
        } else {
          // Update organization data with login response
          const orgFormData: OrganizationOnboardingData = {
            metaData: {
              accountType: 'organization',
              currentPage: lastCompletedPage,
            },
            orgData: {
              name: userProfile.firstName || '', // Use firstName as org name (backend sends it here)
              category: userProfile.category || '',
              website: userProfile.website || '',
              mission: userProfile.mission || '',
              causes: userProfile.causeNames || [],
              logo: null,
              disclaimerAgreed: false,
            },
            locationDto: {
              address: userProfile.address || '',
              city: userProfile.city || '',
              zipCode: userProfile.zipCode || '',
              countryId: userProfile.foundationCountry || '',
              countryName: userProfile.countryName || '',
              stateId: userProfile.foundationState || '',
            },
          };

          set({
            accountType: 'organization',
            currentStep: lastCompletedPage,
            isComplete: hasCompletedOnboarding,
            formData: orgFormData,
            organizationData: {
              currentStep: lastCompletedPage,
              isComplete: hasCompletedOnboarding,
              formData: orgFormData,
              lastVisited: Date.now(),
            },
            lastVisited: Date.now(),
          });
        }
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
              route = '/signup?type=volunteer';
            } else {
              route = '/onboarding?type=volunteer';
            }
          } else {
            if (accountData.currentStep === 0) {
              route = '/signup?type=organization';
            } else {
              route = '/onboarding?type=organization';
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
        // Step 1: Must have authInfo with email filled (signup completed)
        // Note: Passwords are no longer stored in client-side state for security
        // Step 2+: Must have completed previous onboarding step
        if (step === 0) return true;
        if (step === 1) {
          return !!(accountData.formData.authInfo?.email && 
                   accountData.formData.authInfo?.hasAcceptedTOC);
        }
        // For onboarding steps, check if current step is completed
        return accountData.currentStep >= step - 1;
      },
    }),
    {
      name: 'onboarding-storage',
      // SECURITY: Persist ONLY non-sensitive progress data.
      // Email addresses are NEVER persisted implicitly — they are only stored
      // in localStorage via saveRememberMe() when the user explicitly
      // ticks "Remember me" on the login or signup screen.
      partialize: (state) => ({
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        isComplete: state.isComplete,
        lastVisited: state.lastVisited,
        accountType: state.accountType,
        currentUserEmail: state.currentUserEmail,
        formData: state.formData,
        volunteerData: state.volunteerData,
        organizationData: {
          ...state.organizationData,
          formData: {
            ...state.organizationData.formData,
            authInfo: undefined,
          },
        },
      }),
    }
  )
);