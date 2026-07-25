'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { volunteerSignUpAction, loginAction, logoutAction, resetPasswordAction } from '@/app/actions/auth';
import { VolunteerSignUpDto, LoginRequestModel, User } from '@/types/api';
import { useAuthStore } from '@/store';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: setLogin, logout: setLogout } = useAuthStore();

  const volunteerSignUp = async (data: VolunteerSignUpDto) => {
    setIsLoading(true);
    try {
      console.log('useAuthActions: volunteerSignUp called with data:', data);
      const result = await volunteerSignUpAction(data);
      console.log('useAuthActions: volunteerSignUpAction result:', result);
      
      if (result.success) {
        const message = result.data && typeof result.data === 'object' && 'message' in result.data 
          ? (result.data as { message: string }).message 
          : 'Volunteer registration successful!';
        toast.success(message, {
          duration: 3000,
        });
        return { success: true, data: result.data };
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
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

  const login = async (data: LoginRequestModel) => {
    setIsLoading(true);
    try {
      const result = await loginAction(data);
      
      if (result.success) {
        toast.success('Login successful!', {
          duration: 3000,
        });
        
        // Update auth store with user data
        if (result.data && typeof result.data === 'object' && 'user' in result.data) {
          const data = result.data as { user: User; token?: string };
          setLogin(data.user, data.token || '');
        }
        
        return { success: true, data: result.data };
      } else {
        // Show the actual API error message
        toast.error(result.error || 'Login failed. Please try again.', {
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
      const result = await logoutAction();
      
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

  return {
    volunteerSignUp,
    login,
    logout,
    resetPassword,
    isLoading,
  };
}
