'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Helper function to prevent duplicate toasts
const showToast: {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => void;
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => void;
} = {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
    toast.dismiss();
    toast.success(message, options);
  },
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
    toast.dismiss();
    toast.error(message, options);
  },
};

import {
  volunteerSignUpAction,
  organizationSignUpAction,
  verifyOtpAction,
  verifyTwoFactorAction,
  resendOtpAction,
  loginAction,
  logoutAction as authLogoutAction,
  forgotPasswordAction,
  resetPasswordAction,
  verifyForgotPasswordOtpAction,
  verifyResetPasswordOtpAction,
  verifyResetPasswordAction,
  volunteerOnboardingAction,
  organizationOnboardingAction,
  refreshTokenAction,
  validateTokenAction,
  getVolunteerProfileAction,
  getFoundationProfileAction,
} from '@/app/actions/auth';
import {
  VolunteerSignUpRequest,
  OrganizationSignUpRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  LoginRequestModel,
  VolunteerOnboardingRequest,
  OrganizationOnboardingRequest,
  TwoFactorVerificationRequest,
} from '@/types/api';
import { useAuthStore, useOnboardingStore } from '@/store';
import type { User, UserRole } from '@/store/authStore';

interface LoginDataWithExtractedUser {
  userProfile?: User;
  extractedUserData?: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  nameid?: string;
  email?: string;
  accountType?: string;
  accessToken?: string;
  hasCompletedOnboarding?: boolean;
  lastCompletedPage?: number;
  [key: string]: unknown;
}

export interface EnhancedLoginResult {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  redirect?: string;
  requiresOnboarding?: boolean;
  accountType?: string;
  lastCompletedPage?: number;
  hasCompletedOnboarding?: boolean;
  requiresVerification?: boolean;
  emailForVerification?: string;
  requiresTwoFactor?: boolean;
  email?: string;
  errors?: Record<string, string[]> | unknown[];
}

export interface TwoFactorVerifyResult {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | unknown[];
  redirect?: string;
}

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: setLogin, logout: setLogout } = useAuthStore();
  const { clearOnboarding, clearAllOnboarding, setCurrentStep, switchAccountType } = useOnboardingStore();

  const volunteerSignUp = async (data: VolunteerSignUpRequest) => {
    setIsLoading(true);
    try {
      const result = await volunteerSignUpAction(data);

      if (result.success) {
        // Clear any existing onboarding data to prevent loading old data
        // Only clear if different user
        clearOnboarding(data.email);
        
        // Display the backend success message if available, otherwise fallback
        showToast.success(result.message || 'Volunteer registration successful!', {
          duration: 3000,
        });
        return { success: true, data: result.data, message: result.message };
      } else {
        // Handle validation errors - only when there are actual error entries
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          showToast.error(result.error || 'Registration failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in volunteerSignUp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred during registration. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred during registration. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const organizationSignUp = async (data: OrganizationSignUpRequest) => {
    setIsLoading(true);
    try {
      const result = await organizationSignUpAction(data);

      if (result.success) {
        // Clear any existing onboarding data to prevent loading old data
        // Only clear if different user
        clearOnboarding(data.email);
        
        // Display the backend success message if available, otherwise fallback
        showToast.success(result.message || 'Organization registration successful!', {
          duration: 3000,
        });
        return { success: true, data: result.data, message: result.message };
      } else {
        // Handle validation errors - only when there are actual error entries
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          showToast.error(result.error || 'Registration failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in organizationSignUp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred during registration. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred during registration. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (data: OtpVerificationRequest) => {
    setIsLoading(true);
    try {
      const result = await verifyOtpAction(data);

      if (result.success) {
        // Don't show toast here - let the calling component handle it
        return { success: true, data: result.data, message: result.message };
      } else {
        // Handle validation errors - only when there are actual error entries
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          showToast.error(result.error || 'OTP verification failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in verifyOtp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred during OTP verification. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred during OTP verification. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (data: TwoFactorVerificationRequest): Promise<TwoFactorVerifyResult> => {
    setIsLoading(true);
    try {
      const result = await verifyTwoFactorAction(data);

      if (result.success) {
        // Display the backend success message if available, otherwise fallback
        showToast.success(result.message || '2FA verified successfully!', {
          duration: 3000,
        });
        return { success: true, data: result.data, message: result.message, redirect: result.redirect };
      } else {
        // Handle validation errors - only when there are actual error entries
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          showToast.error(result.error || '2FA verification failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in verifyTwoFactor:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred during 2FA verification. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred during 2FA verification. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    setIsLoading(true);
    try {
      const result = await refreshTokenAction();

      if (result.success) {
        // Display the backend success message if available, otherwise fallback
        showToast.success(result.message || 'Token refreshed successfully!', {
          duration: 3000,
        });
        return { success: true, data: result.data, message: result.message };
      } else {
        // Show the actual API error message
        showToast.error(result.error || 'Token refresh failed. Please try again.', {
          duration: 4000,
        });
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in refreshAccessToken:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred during token refresh. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred during token refresh. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async () => {
    try {
      const result = await validateTokenAction();
      return result;
    } catch (error) {
      console.error('useAuthActions: Error caught in validateToken:', error);
      return {
        success: true,
        isValid: false,
      };
    }
  };

  const getVolunteerProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getVolunteerProfileAction();
      if (result.success) {
        return { success: true, data: result.data, message: result.message };
      } else {
        showToast.error(result.error || 'Failed to fetch volunteer profile', {
          duration: 4000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in getVolunteerProfile:', error);
      showToast.error('Failed to fetch volunteer profile. Please try again.', {
        duration: 4000,
      });
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const getFoundationProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getFoundationProfileAction();
      if (result.success) {
        return { success: true, data: result.data, message: result.message };
      } else {
        showToast.error(result.error || 'Failed to fetch foundation profile', {
          duration: 4000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in getFoundationProfile:', error);
      showToast.error('Failed to fetch foundation profile. Please try again.', {
        duration: 4000,
      });
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (data: ResendOtpRequest) => {
    setIsLoading(true);
    try {
      console.log('[useAuthActions] resendOtp called with:', data);
      const result = await resendOtpAction(data);
      console.log('[useAuthActions] resendOtp result:', result);

      if (result.success) {
        return { success: true, data: result.data, message: result.message };
      } else {
        // Handle validation errors - only when there are actual error entries
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          showToast.error(result.error || 'Failed to resend OTP. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('[useAuthActions] Error caught in resendOtp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.dismiss();
        showToast.error('An unexpected error occurred. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequestModel): Promise<EnhancedLoginResult> => {
    setIsLoading(true);
    try {
      const result = await loginAction(data);

      if (result.success) {
        // Check if two-factor authentication is required
        if (result.requiresTwoFactor && result.email) {
          // logger.log('[Login] Two-factor authentication required, redirecting to verify page');
          showToast.success('Two-factor code sent to your email', {
            duration: 3000,
          });
          return {
            success: true,
            redirect: `/verify?email=${encodeURIComponent(result.email)}&purpose=TwoFactorAuthenticationLogin`,
            requiresTwoFactor: true,
            email: result.email,
          } as EnhancedLoginResult;
        }

        // Display the backend success message if available, otherwise fallback
        const successMessage = typeof result.message === 'string' ? result.message : 'Login successful!';
        showToast.success(successMessage, {
          duration: 3000,
        });

        // Process login response data for redirect logic
        const loginData = result.data as LoginDataWithExtractedUser | undefined;
        
        if (loginData) {
          // Extract account type and onboarding status
          const accountType = loginData.accountType as string | undefined;
          const hasCompletedOnboarding = loginData.hasCompletedOnboarding as boolean | undefined;
          const lastCompletedPage = loginData.lastCompletedPage as number | undefined;
          
          // logger.log('[Login] Account Type:', accountType);
          // logger.log('[Login] Has Completed Onboarding:', hasCompletedOnboarding);
          // logger.log('[Login] Last Completed Page:', lastCompletedPage);
          
          // Preserve local onboarding data - don't clear it
          // Instead, update the onboarding store with the latest data from login API
          // The lastCompletedPage from API will be used to redirect to the correct step
          // but local form data should be preserved for the user
          
          // Update onboarding store with login API data
          // Handle both "organization" and "foundation" as organization accounts
          const normalizedAccountTypeForOnboarding = (() => {
            const type = accountType?.toLowerCase();
            if (type === 'foundation' || type === 'organization') {
              return 'organization';
            }
            return type as 'volunteer' | 'organization' | undefined;
          })();
          
          if (normalizedAccountTypeForOnboarding) {
            // Only set the currentStep for redirection, don't populate form data
            // Form data should only be populated when the onboarding API succeeds or when user navigates to a page
            switchAccountType(normalizedAccountTypeForOnboarding === 'organization' ? 'organization' : 'volunteer');
            // lastCompletedPage is 1-based (API page), currentStep is 0-based (UI step)
            // If lastCompletedPage is 1, we want to show step 1 (page 2), so currentStep = lastCompletedPage
            setCurrentStep(lastCompletedPage || 0);
            // logger.log('[Login] Set onboarding currentStep to:', lastCompletedPage || 0);
          }
          
          // Update auth store with user data
          // logger.log('[Login] loginData keys:', Object.keys(loginData));
          // logger.log('[Login] loginData.userProfile:', loginData.userProfile);
          // logger.log('[Login] loginData.extractedUserData:', loginData.extractedUserData);
          
          if (loginData.userProfile && typeof loginData.userProfile === 'object') {
            const userProfile = loginData.userProfile as unknown as Record<string, unknown>;
            // Include account type from login response and map userProfile fields to User interface
            // Handle both "organization" and "foundation" as organization accounts
            const normalizedAccountTypeForUser = (() => {
              const type = accountType?.toLowerCase();
              if (type === 'foundation' || type === 'organization') {
                return 'Organization';
              }
              return accountType as 'Volunteer' | 'Organization' | 'Admin';
            })();
            
            const userWithAccountType: User = {
              id: userProfile.email as string || '', // Use email as ID if not provided
              email: userProfile.email as string || '',
              // For organizations, use foundationName from userProfile
              firstName: userProfile.firstName as string || '',
              lastName: userProfile.lastName as string || '',
              otherName: userProfile.otherName as string || '',
              organizationName: loginData.organizationName as string || userProfile.foundationName as string || undefined,
              accountType: normalizedAccountTypeForUser,
              userImage: userProfile.userImage as string | null || null,
              logo: loginData.organizationLogo as string || userProfile.logo as string | null || undefined,
              location: userProfile.city && userProfile.stateName ? `${userProfile.city}, ${userProfile.stateName}` : null,
              bio: userProfile.bio as string | null || null,
              skills: userProfile.skillNames as string[] || [],
              interests: userProfile.interestNames as string[] || [],
            };
            // logger.log('[Login] Using userProfile:', userWithAccountType);
            setLogin(userWithAccountType, loginData.accessToken as string || '');
          } else if (loginData.extractedUserData) {
            // TEMPORARY WORKAROUND: Use extracted user data from JWT since userProfile is null
            const extracted = loginData.extractedUserData;
            const userFromJwt: User = {
              id: extracted.id as string,
              email: extracted.email as string,
              role: extracted.role as UserRole,
              firstName: extracted.firstName as string,
              lastName: extracted.lastName as string,
              accountType: accountType as 'Volunteer' | 'Organization' | 'Admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            // logger.log('[Login] Using extracted user data from JWT:', userFromJwt);
            setLogin(userFromJwt, loginData.accessToken as string || '');
          } else {
            // If userProfile is not available, create minimal user object with account type
            const minimalUser: User = {
              id: loginData.nameid as string || '',
              email: loginData.email as string || '',
              accountType: accountType as 'Volunteer' | 'Organization' | 'Admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            // logger.log('[Login] Using minimal user object:', minimalUser);
            setLogin(minimalUser, loginData.accessToken as string || '');
          }
          
          // Determine redirect based on account type and onboarding status
          // Handle both "organization" and "foundation" as organization accounts
          const normalizedAccountType = (() => {
            const type = accountType?.toLowerCase();
            if (type === 'foundation' || type === 'organization') {
              return 'organization';
            }
            return type as 'volunteer' | 'organization' | 'admin' | undefined;
          })();
          
          if (!hasCompletedOnboarding) {
            // Redirect to onboarding (account type is read from cookies)
            if (normalizedAccountType === 'organization') {
              // logger.log('[Login] Redirecting to organization onboarding');
              return {
                success: true, 
                data: result.data, 
                message: result.message,
                redirect: '/onboarding',
                requiresOnboarding: true,
                accountType: 'organization',
                lastCompletedPage: lastCompletedPage || 0,
                hasCompletedOnboarding: hasCompletedOnboarding || false
              } as EnhancedLoginResult;
            } else if (normalizedAccountType === 'volunteer') {
              // logger.log('[Login] Redirecting to volunteer onboarding');
              return {
                success: true, 
                data: result.data, 
                message: result.message,
                redirect: '/onboarding',
                requiresOnboarding: true,
                accountType: 'volunteer',
                lastCompletedPage: lastCompletedPage || 0,
                hasCompletedOnboarding: hasCompletedOnboarding || false
              } as EnhancedLoginResult;
            }
          } else {
            // User has completed onboarding, redirect to appropriate dashboard
            if (normalizedAccountType === 'organization') {
              // logger.log('[Login] Redirecting to organization dashboard');
              return { 
                success: true, 
                data: result.data, 
                message: result.message,
                redirect: '/org/dashboard',
                requiresOnboarding: false,
                accountType: 'organization'
              } as EnhancedLoginResult;
            } else if (normalizedAccountType === 'volunteer') {
              // logger.log('[Login] Redirecting to volunteer dashboard');
              return {
                success: true,
                data: result.data,
                message: result.message,
                redirect: '/home',
                requiresOnboarding: false,
                accountType: 'volunteer'
              } as EnhancedLoginResult;
            } else if (normalizedAccountType === 'admin') {
              // logger.log('[Login] Redirecting to admin dashboard');
              return { 
                success: true, 
                data: result.data, 
                message: result.message,
                redirect: '/admin/dashboard',
                requiresOnboarding: false,
                accountType: 'admin'
              } as EnhancedLoginResult;
            }
          }
        }

        return { success: true, data: result.data, message: result.message, redirect: '/home' } as EnhancedLoginResult;
      } else {
        // Show the actual API error message
        const errorMessage = typeof result.error === 'string' ? result.error : 'Login failed. Please try again.';
        
        // Check if account is not active and requires email verification
        if (errorMessage.toLowerCase().includes('account not active') || 
            errorMessage.toLowerCase().includes('confirm your email') ||
            errorMessage.toLowerCase().includes('please confirm your email')) {
          // Don't show toast, just redirect to verification
          return { 
            success: false, 
            error: result.error,
            requiresVerification: true,
            emailForVerification: data.email,
            redirect: `/verify?email=${encodeURIComponent(data.email)}&type=volunteer&resend=true`
          } as EnhancedLoginResult;
        }
        
        showToast.error(errorMessage, {
          duration: 4000,
        });
        return { success: false, error: result.error } as EnhancedLoginResult;
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in login:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred during login. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred during login. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' } as EnhancedLoginResult;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Step 1: Set logout flag to prevent immediate redirect on root page
      if (typeof window !== 'undefined') {
        localStorage.setItem('has_logged_out', 'true');
      }

      // Step 2: Clear ALL localStorage items systematically
      if (typeof window !== 'undefined') {
        // Clear known app-specific storage keys
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('onboarding-storage');
        localStorage.removeItem('ivoluntia_device_secret');
        localStorage.removeItem('ivoluntia_remember_me');
        localStorage.removeItem('has_logged_out');
        
        // Clear any other zustand persisted storage
        Object.keys(localStorage).forEach(key => {
          if (key.includes('-storage') || key.startsWith('zustand')) {
            localStorage.removeItem(key);
          }
        });
        
        // Final clear of any remaining items
        localStorage.clear();
      }

      // Step 3: Clear ALL cookies (both HTTP-only and regular)
      // NOTE: 'cookieConsent' is intentionally excluded - it's a browser-level preference
      // that should persist across login/logout cycles for legal compliance and UX
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          // Skip cookieConsent - it should persist across login/logout
          if (cookieName !== 'cookieConsent') {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
          }
        });
      }

      // Step 4: Clear auth store (this will also clear cookies)
      setLogout();

      // Step 5: Clear ALL onboarding store data (force clear)
      clearAllOnboarding();

      // Clear onboarding localStorage directly to ensure it's gone
      if (typeof window !== 'undefined') {
        localStorage.removeItem('onboarding-storage');
      }

      // Step 6: Call server logout to clear HTTP cookies
      const result = await authLogoutAction();

      if (result.success) {
        // Step 7: Final cleanup - ensure everything is cleared
        if (typeof window !== 'undefined') {
          // Double-check and clear any remaining localStorage
          Object.keys(localStorage).forEach(key => {
            localStorage.removeItem(key);
          });
          localStorage.clear();
          
          // Double-check and clear any remaining cookies
          // NOTE: 'cookieConsent' is intentionally excluded - it should persist
          const cookies = document.cookie.split(';');
          cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            if (cookieName !== 'cookieConsent') {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
            }
          });
        }

        showToast.success('Logged out successfully', {
          duration: 2000,
        });

        return { success: true };
      } else {
        // Even if server logout fails, we've cleared local state
        showToast.error('Logout completed with warnings. Please clear your browser cookies.', {
          duration: 3000,
        });
        return { success: true }; // Return success since local state is cleared
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in logout:', error);
      // Even if there's an error, we've cleared local state
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('Logout completed. Local data has been cleared.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('Logout completed. Local data has been cleared.', {
          duration: 5000,
        });
      }
      return { success: true }; // Return success since local state is cleared
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data: { email: string; newPassword: string; confirmPassword: string; token: string }) => {
    setIsLoading(true);
    try {
      console.log('[useAuthActions] forgotPassword called with email:', data.email);
      console.log('[useAuthActions] Token present:', !!data.token);
      const result = await forgotPasswordAction(data.email, data.newPassword, data.confirmPassword, data.token);
      console.log('[useAuthActions] forgotPassword result:', result);

      if (result.success) {
        return { success: true, message: result.message };
      } else {
        // Check for invalid token error
        if (result.error?.toLowerCase().includes('invalid token')) {
          showToast.error('Invalid or expired token. Please request a new OTP.', {
            duration: 5000,
          });
          window.location.href = '/forgotpassword';
        } else {
          showToast.error(result.error || 'Failed to reset password. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in forgotPassword:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('invalid token')) {
          // Clear cookies and redirect to forgot password on invalid token
          document.cookie = 'reset_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'reset_otp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          showToast.error('Invalid or expired token. Please request a new OTP.', {
            duration: 5000,
          });
          window.location.href = '/forgotpassword';
        } else {
          // Show the actual error message from the API
          showToast.error(error.message || 'An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await resetPasswordAction(email);

      if (result.success) {
        showToast.success(result.message || 'Password reset email sent', {
          duration: 3000,
        });
        return { success: true, message: result.message };
      } else {
        showToast.error(result.error || 'Failed to send reset email. Please try again.', {
          duration: 4000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in resetPassword:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const volunteerOnboarding = async (data: VolunteerOnboardingRequest) => {
    setIsLoading(true);
    try {
      const result = await volunteerOnboardingAction(data);

      if (result.success) {
        showToast.success(result.message || 'Volunteer onboarding completed!', {
          duration: 3000,
        });
        return { success: true, data: result.data, message: result.message };
      } else {
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          showToast.error(result.error || 'Onboarding failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in volunteerOnboarding:', error);
      if (error instanceof Error) {
        showToast.error('An unexpected error occurred during onboarding. Please try again.', {
          duration: 5000,
        });
      } else {
        showToast.error('An unexpected error occurred during onboarding. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const organizationOnboarding = async (data: OrganizationOnboardingRequest) => {
    setIsLoading(true);
    try {
      const result = await organizationOnboardingAction(data);

      if (result.success) {
        showToast.success(result.message || 'Organization onboarding completed!', {
          duration: 3000,
        });
        return { success: true, data: result.data, message: result.message };
      } else {
        const hasValidationErrors = result.errors && (
          (Array.isArray(result.errors) && result.errors.length > 0) ||
          (!Array.isArray(result.errors) && Object.keys(result.errors).length > 0)
        );
        if (hasValidationErrors) {
          const errors = result.errors!;
          const errorMessages = Array.isArray(errors)
            ? errors.filter((e): e is string => typeof e === 'string')
            : Object.values(errors).flat();
          errorMessages.forEach((message) => {
            showToast.error(message, {
              duration: 4000,
            });
          });
        } else {
          showToast.error(result.error || 'Onboarding failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in organizationOnboarding:', error);
      if (error instanceof Error) {
        showToast.error('An unexpected error occurred during onboarding. Please try again.', {
          duration: 5000,
        });
      } else {
        showToast.error('An unexpected error occurred during onboarding. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetPassword = async (email: string, newPassword: string, confirmPassword: string, token: string) => {
    setIsLoading(true);
    try {
      const result = await verifyResetPasswordAction(email, newPassword, confirmPassword, token);

      if (result.success) {
        showToast.success(result.message || 'Password reset successfully', {
          duration: 3000,
        });
        return { success: true, message: result.message };
      } else {
        showToast.error(result.error || 'Failed to reset password. Please try again.', {
          duration: 4000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in verifyResetPassword:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          showToast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        showToast.error('An unexpected error occurred. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyForgotPasswordOtp = async (otpCode: string) => {
    setIsLoading(true);
    try {
      console.log('[useAuthActions] verifyForgotPasswordOtp called with:', otpCode);
      const result = await verifyForgotPasswordOtpAction(otpCode);
      console.log('[useAuthActions] verifyForgotPasswordOtp result:', result);

      if (result.success) {
        return { success: true, token: result.token, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('[useAuthActions] Error caught in verifyForgotPasswordOtp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.dismiss();
        showToast.error('An unexpected error occurred. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetPasswordOtp = async (otpCode: string) => {
    setIsLoading(true);
    try {
      console.log('[useAuthActions] verifyResetPasswordOtp called with:', otpCode);
      const result = await verifyResetPasswordOtpAction(otpCode);
      console.log('[useAuthActions] verifyResetPasswordOtp result:', result);

      if (result.success) {
        return { success: true, token: result.token, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('[useAuthActions] Error caught in verifyResetPasswordOtp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          showToast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          showToast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.dismiss();
        showToast.error('An unexpected error occurred. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    volunteerSignUp,
    organizationSignUp,
    verifyOtp,
    verifyTwoFactor,
    resendOtp,
    login,
    logout,
    refreshAccessToken,
    validateToken,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordOtp,
    verifyResetPasswordOtp,
    verifyResetPassword,
    volunteerOnboarding,
    organizationOnboarding,
    getVolunteerProfile,
    getFoundationProfile,
    isLoading,
  };
}
