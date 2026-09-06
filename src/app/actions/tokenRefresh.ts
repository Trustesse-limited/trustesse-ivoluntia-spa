'use server';

import { refreshAccessToken } from '@/lib/authToken.server';

/**
 * Server Action for Token Refresh
 * 
 * SECURITY: Pure Server-Side Token Refresh
 * 
 * This action handles token refresh entirely on the server side using HTTP-only cookies.
 * Client components can call this action, but the actual token refresh happens server-side
 * with no exposure to client-side JavaScript.
 * 
 * Flow:
 * 1. Client component calls this server action
 * 2. Server reads refresh token from HTTP-only cookie
 * 3. Server calls backend refresh endpoint
 * 4. Server updates HTTP-only cookies with new tokens
 * 5. Client receives success/failure response (no tokens exposed)
 */
export async function refreshTokenAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('🔄 [Server Action] refreshTokenAction called');
    
    const newAccessToken = await refreshAccessToken();
    
    if (!newAccessToken) {
      console.log('🔴 [Server Action] refreshTokenAction failed - no token returned');
      return {
        success: false,
        error: 'Failed to refresh access token',
      };
    }
    
    console.log('✅ [Server Action] refreshTokenAction completed');
    
    return {
      success: true,
    };
  } catch (error) {
    console.log('🔴 [Server Action] refreshTokenAction error:', error);
    return {
      success: false,
      error: 'Failed to refresh access token',
    };
  }
}