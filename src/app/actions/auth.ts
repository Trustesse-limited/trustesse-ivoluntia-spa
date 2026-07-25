'use server';

import { volunteerSignUp, login, resetPassword } from '@/lib/server-api';
import { VolunteerSignUpDto, LoginRequestModel, ApiResponse, ApiError } from '@/types/api';
import { cookies } from 'next/headers';

/**
 * Server Action for Volunteer Sign Up
 * This can be called from client components but executes on the server
 */
export async function volunteerSignUpAction(data: VolunteerSignUpDto): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
  errors?: Record<string, string[]>;
}> {
  try {
    console.log('Server Action: volunteerSignUpAction called with data:', JSON.stringify(data, null, 2));
    const response: ApiResponse<unknown> = await volunteerSignUp(data);
    console.log('Server Action: API response received:', JSON.stringify(response, null, 2));
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log('Server Action: Error caught:', error);
    const apiError = error as ApiError;
    
    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to sign up volunteer',
    };
  }
}

/**
 * Server Action for Login
 * This can be called from client components but executes on the server
 */
export async function loginAction(data: LoginRequestModel): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const response: ApiResponse<unknown> = await login(data);
    
    // Store token in HTTP-only cookie for security
    if (response.data && typeof response.data === 'object' && 'token' in response.data) {
      const cookieStore = await cookies();
      cookieStore.set('auth_token', response.data.token as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const apiError = error as ApiError;
    
    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to login',
    };
  }
}

/**
 * Server Action for Reset Password
 * This can be called from client components but executes on the server
 */
export async function resetPasswordAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response: ApiResponse<unknown> = await resetPassword(email);
    
    return {
      success: true,
      message: (response.data as { message?: string })?.message || 'Password reset email sent successfully',
    };
  } catch (error) {
    const apiError = error as ApiError;
    
    // Return the actual API error message
    return {
      success: false,
      error: apiError.message || 'Failed to reset password',
    };
  }
}

/**
 * Server Action for Logout
 * Removes the auth token from HTTP-only cookie
 */
export async function logoutAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    
    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to logout',
    };
  }
}
