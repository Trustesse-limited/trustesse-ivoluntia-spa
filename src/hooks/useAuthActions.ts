'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  volunteerSignUpAction,
  organizationSignUpAction,
  verifyOtpAction,
  resendOtpAction,
  loginAction,
  logoutAction as authLogoutAction,
  forgotPasswordAction,
  resetPasswordAction,
  verifyResetPasswordAction,
  volunteerOnboardingAction,
  organizationOnboardingAction,
} from '@/app/actions/auth';
import {
  VolunteerSignUpRequest,
  OrganizationSignUpRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  LoginRequestModel,
  VolunteerOnboardingRequest,
  OrganizationOnboardingRequest,
} from '@/types/api';
import { useAuthStore, useOnboardingStore } from '@/store';
import type { User, UserRole } from '@/store/authStore';
import logger from '@/lib/logger';

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
}

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: setLogin, logout: setLogout } = useAuthStore();
  const { clearOnboarding, clearAllOnboarding, setCurrentStep, setAccountType, updateFormData } = useOnboardingStore();

  const volunteerSignUp = async (data: VolunteerSignUpRequest) => {
    setIsLoading(true);
    try {
      const result = await volunteerSignUpAction(data);

      if (result.success) {
        // Clear any existing onboarding data to prevent loading old data
        // Only clear if different user
        clearOnboarding(data.email);
        
        // Display the backend success message if available, otherwise fallback
        toast.success(result.message || 'Volunteer registration successful!', {
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
            toast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          toast.error(result.error || 'Registration failed. Please try again.', {
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
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred during registration. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred during registration. Please try again.', {
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
        toast.success(result.message || 'Organization registration successful!', {
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
            toast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          toast.error(result.error || 'Registration failed. Please try again.', {
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
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred during registration. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred during registration. Please try again.', {
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
        // Display the backend success message if available, otherwise fallback
        toast.success(result.message || 'OTP verified successfully!', {
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
            toast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          toast.error(result.error || 'OTP verification failed. Please try again.', {
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
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred during OTP verification. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred during OTP verification. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (data: ResendOtpRequest) => {
    setIsLoading(true);
    try {
      const result = await resendOtpAction(data);

      if (result.success) {
        // Display the backend success message if available, otherwise fallback
        toast.success(result.message || 'OTP resent successfully!', {
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
            toast.error(message, {
              duration: 4000,
            });
          });
        } else {
          // Show the actual API error message
          toast.error(result.error || 'Failed to resend OTP. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in resendOtp:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
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
        // Display the backend success message if available, otherwise fallback
        const successMessage = typeof result.message === 'string' ? result.message : 'Login successful!';
        toast.success(successMessage, {
          duration: 3000,
        });

        // Process login response data for redirect logic
        const loginData = result.data as LoginDataWithExtractedUser | undefined;
        
        if (loginData) {
          // Extract account type and onboarding status
          const accountType = loginData.accountType as string | undefined;
          const hasCompletedOnboarding = loginData.hasCompletedOnboarding as boolean | undefined;
          const lastCompletedPage = loginData.lastCompletedPage as number | undefined;
          
          logger.log('[Login] Account Type:', accountType);
          logger.log('[Login] Has Completed Onboarding:', hasCompletedOnboarding);
          logger.log('[Login] Last Completed Page:', lastCompletedPage);
          
          // Preserve local onboarding data - don't clear it
          // Instead, update the onboarding store with the latest data from login API
          // The lastCompletedPage from API will be used to redirect to the correct step
          // but local form data should be preserved for the user
          
          // Update onboarding store with login API data
          const normalizedAccountType = accountType?.toLowerCase() as 'volunteer' | 'organization' | undefined;
          if (normalizedAccountType) {
            setAccountType(normalizedAccountType);
            setCurrentStep((lastCompletedPage || 0) + 1);
            updateFormData({
              metaData: {
                accountType: normalizedAccountType,
                currentPage: (lastCompletedPage || 0) + 1,
              },
            });
          }
          
          // Update auth store with user data
          logger.log('[Login] loginData keys:', Object.keys(loginData));
          logger.log('[Login] loginData.userProfile:', loginData.userProfile);
          logger.log('[Login] loginData.extractedUserData:', loginData.extractedUserData);
          
          if (loginData.userProfile && typeof loginData.userProfile === 'object') {
            const userProfile = loginData.userProfile as User;
            // Include account type from login response
            const userWithAccountType: User = {
              ...userProfile,
              accountType: accountType as 'Volunteer' | 'Organization' | 'Admin',
            };
            logger.log('[Login] Using userProfile:', userWithAccountType);
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
            logger.log('[Login] Using extracted user data from JWT:', userFromJwt);
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
            logger.log('[Login] Using minimal user object:', minimalUser);
            setLogin(minimalUser, loginData.accessToken as string || '');
          }
          
          // Determine redirect based on account type and onboarding status
          if (!hasCompletedOnboarding) {
            // Redirect to onboarding (account type is read from cookies)
            const normalizedAccountType = accountType?.toLowerCase();
            if (normalizedAccountType === 'organization') {
              logger.log('[Login] Redirecting to organization onboarding');
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
              logger.log('[Login] Redirecting to volunteer onboarding');
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
            const normalizedAccountType = accountType?.toLowerCase();
            if (normalizedAccountType === 'organization') {
              logger.log('[Login] Redirecting to organization dashboard');
              return { 
                success: true, 
                data: result.data, 
                message: result.message,
                redirect: '/org/dashboard',
                requiresOnboarding: false,
                accountType: 'organization'
              } as EnhancedLoginResult;
            } else if (normalizedAccountType === 'volunteer') {
              logger.log('[Login] Redirecting to volunteer dashboard');
              return { 
                success: true, 
                data: result.data, 
                message: result.message,
                redirect: '/volunteer',
                requiresOnboarding: false,
                accountType: 'volunteer'
              } as EnhancedLoginResult;
            } else if (normalizedAccountType === 'admin') {
              logger.log('[Login] Redirecting to admin dashboard');
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
        
        toast.error(errorMessage, {
          duration: 4000,
        });
        return { success: false, error: result.error } as EnhancedLoginResult;
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in login:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred during login. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred during login. Please try again.', {
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
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
        });
      }

      // Step 4: Clear auth store (this will also clear cookies)
      setLogout();

      // Step 5: Clear ALL onboarding store data (force clear)
      clearAllOnboarding();

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
          const cookies = document.cookie.split(';');
          cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
          });
        }

        toast.success('Logged out successfully', {
          duration: 2000,
        });

        return { success: true };
      } else {
        // Even if server logout fails, we've cleared local state
        toast.error('Logout completed with warnings. Please clear your browser cookies.', {
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
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('Logout completed. Local data has been cleared.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('Logout completed. Local data has been cleared.', {
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
      const result = await forgotPasswordAction(data.email, data.newPassword, data.confirmPassword, data.token);

      if (result.success) {
        toast.success(result.message || 'Password reset successfully', {
          duration: 3000,
        });
        return { success: true, message: result.message };
      } else {
        // Check for invalid token error
        if (result.error?.toLowerCase().includes('invalid token')) {
          // Clear cookies and redirect to forgot password on invalid token
          document.cookie = 'reset_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'reset_otp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          toast.error('Invalid or expired token. Please request a new OTP.', {
            duration: 5000,
          });
          window.location.href = '/forgotpassword';
        } else {
          toast.error(result.error || 'Failed to reset password. Please try again.', {
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
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('invalid token')) {
          // Clear cookies and redirect to forgot password on invalid token
          document.cookie = 'reset_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'reset_otp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          toast.error('Invalid or expired token. Please request a new OTP.', {
            duration: 5000,
          });
          window.location.href = '/forgotpassword';
        } else {
          // Show the actual error message from the API
          toast.error(error.message || 'An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
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
        toast.success(result.message || 'Password reset email sent', {
          duration: 3000,
        });
        return { success: true, message: result.message };
      } else {
        toast.error(result.error || 'Failed to send reset email. Please try again.', {
          duration: 4000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in resetPassword:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
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
        toast.success(result.message || 'Volunteer onboarding completed!', {
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
            toast.error(message, {
              duration: 4000,
            });
          });
        } else {
          toast.error(result.error || 'Onboarding failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in volunteerOnboarding:', error);
      if (error instanceof Error) {
        toast.error('An unexpected error occurred during onboarding. Please try again.', {
          duration: 5000,
        });
      } else {
        toast.error('An unexpected error occurred during onboarding. Please try again.', {
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
        toast.success(result.message || 'Organization onboarding completed!', {
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
            toast.error(message, {
              duration: 4000,
            });
          });
        } else {
          toast.error(result.error || 'Onboarding failed. Please try again.', {
            duration: 4000,
          });
        }
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in organizationOnboarding:', error);
      if (error instanceof Error) {
        toast.error('An unexpected error occurred during onboarding. Please try again.', {
          duration: 5000,
        });
      } else {
        toast.error('An unexpected error occurred during onboarding. Please try again.', {
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
        toast.success(result.message || 'Password reset successfully', {
          duration: 3000,
        });
        return { success: true, message: result.message };
      } else {
        toast.error(result.error || 'Failed to reset password. Please try again.', {
          duration: 4000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in verifyResetPassword:', error);
      // Check if this is a network/system error vs API error
      if (error instanceof Error) {
        if (error.message.includes('ENOENT') || error.message.includes('.next')) {
          toast.error('Application error: Please refresh the page and try again.', {
            duration: 5000,
          });
        } else if (error.message.toLowerCase().includes('timeout') || error.message.toLowerCase().includes('timed out')) {
          toast.error('Request timed out. Please check your connection and try again.', {
            duration: 5000,
          });
        } else {
          toast.error('An unexpected error occurred. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
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
    resendOtp,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyResetPassword,
    volunteerOnboarding,
    organizationOnboarding,
    isLoading,
  };
}
