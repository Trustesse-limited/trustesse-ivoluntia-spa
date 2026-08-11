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
  resetPasswordAction,
  volunteerOnboardingAction,
  organizationOnboardingAction,
} from '@/app/actions/auth';
import {
  VolunteerSignUpRequest,
  OrganizationSignUpRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  LoginRequestModel,
  User,
  VolunteerOnboardingRequest,
  OrganizationOnboardingRequest,
} from '@/types/api';
import { useAuthStore } from '@/store';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: setLogin, logout: setLogout } = useAuthStore();

  const volunteerSignUp = async (data: VolunteerSignUpRequest) => {
    setIsLoading(true);
    try {
      // SECURITY: Never log sensitive authentication data
      console.log('useAuthActions: volunteerSignUp called');
      const result = await volunteerSignUpAction(data);
      console.log('useAuthActions: volunteerSignUp completed');

      if (result.success) {
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
      // SECURITY: Never log sensitive authentication data
      console.log('useAuthActions: organizationSignUp called');
      const result = await organizationSignUpAction(data);
      console.log('useAuthActions: organizationSignUp completed');

      if (result.success) {
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
      console.log('useAuthActions: verifyOtp called');
      const result = await verifyOtpAction(data);
      console.log('useAuthActions: verifyOtp completed');

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
      console.log('useAuthActions: resendOtp called');
      const result = await resendOtpAction(data);
      console.log('useAuthActions: resendOtp completed');

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

  const login = async (data: LoginRequestModel) => {
    setIsLoading(true);
    try {
      // SECURITY: Never log login credentials
      console.log('useAuthActions: login called');
      const result = await loginAction(data);

      if (result.success) {
        // Display the backend success message if available, otherwise fallback
        const successMessage = typeof result.message === 'string' ? result.message : 'Login successful!';
        toast.success(successMessage, {
          duration: 3000,
        });

        // Update auth store with user data
        if (result.data && typeof result.data === 'object' && 'user' in result.data) {
          const data = result.data as { user: User; token?: string };
          setLogin(data.user, data.token || '');
        }

        return { success: true, data: result.data, message: result.message };
      } else {
        // Show the actual API error message
        const errorMessage = typeof result.error === 'string' ? result.error : 'Login failed. Please try again.';
        toast.error(errorMessage, {
          duration: 4000,
        });
        return { success: false, error: result.error };
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
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const result = await authLogoutAction();

      if (result.success) {
        toast.success('Logged out successfully', {
          duration: 2000,
        });

        // Update auth store
        setLogout();

        return { success: true };
      } else {
        toast.error(result.error || 'Logout failed. Please try again.', {
          duration: 3000,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('useAuthActions: Error caught in logout:', error);
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
          toast.error('An unexpected error occurred during logout. Please try again.', {
            duration: 5000,
          });
        }
      } else {
        toast.error('An unexpected error occurred during logout. Please try again.', {
          duration: 5000,
        });
      }
      return { success: false, error: 'An unexpected error occurred' };
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
      console.log('useAuthActions: volunteerOnboarding called');
      const result = await volunteerOnboardingAction(data);
      console.log('useAuthActions: volunteerOnboarding completed');

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
      console.log('useAuthActions: organizationOnboarding called');
      const result = await organizationOnboardingAction(data);
      console.log('useAuthActions: organizationOnboarding completed');

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

  return {
    volunteerSignUp,
    organizationSignUp,
    verifyOtp,
    resendOtp,
    login,
    logout: authLogoutAction,
    resetPassword,
    volunteerOnboarding,
    organizationOnboarding,
    isLoading,
  };
}
