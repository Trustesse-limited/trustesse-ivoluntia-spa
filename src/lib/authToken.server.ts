/**
 * Server-side JWT Token Management
 * 
 * SECURITY ARCHITECTURE: Pure Server-Side Authentication
 * 
 * This module provides server-side token handling for server components, API routes, and server actions.
 * All tokens are stored in HTTP-only cookies and are never exposed to client-side JavaScript.
 * 
 * Key Features:
 * - Secure token retrieval from HTTP-only cookies
 * - Token validation and refresh logic
 * - Authorization header construction
 * - Graceful error handling
 * - No client-side token exposure
 * 
 * IMPORTANT: This module should only be imported by other server-side modules (server components, API routes, server actions).
 * Client components should use Server Actions in src/app/actions/ instead.
 */

import { cookies } from 'next/headers';
import { API_ENDPOINTS } from './api-config';

// Token names used in cookies
const AUTH_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

/**
 * Public API endpoints that should not include authorization headers
 * These endpoints are used for authentication operations before a user has a token
 */
const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.auth.volunteerSignup,
  API_ENDPOINTS.auth.organizationSignup,
  '/api/v1/Auth/confirmuser',
  API_ENDPOINTS.otp.resend,
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.resetPassword,
  API_ENDPOINTS.auth.forgotPassword,
  '/api/v1/countries/countries',
  '/api/v1/countries/states',
];

/**
 * Check if a URL is a public endpoint that should not include auth headers
 */
export function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

/**
 * Server-side: Get access token from HTTP-only cookies
 * This can only be used in server components, API routes, and server actions
 */
export async function getServerAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_TOKEN_COOKIE)?.value || null;
  } catch (error) {
    return null;
  }
}

/**
 * Server-side: Get refresh token from HTTP-only cookies
 */
export async function getServerRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null;
  } catch (error) {
    return null;
  }
}

/**
 * Construct Authorization header with Bearer token
 */
export function getAuthHeader(token: string | null): Record<string, string> {
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Validate if a token looks like a JWT (basic format check)
 */
export function isValidJwtFormat(token: string): boolean {
  // JWT should have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Decode JWT payload (without verification - for inspection only)
 * Never use this for security decisions
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired (based on exp claim)
 * Returns true if expired or invalid, false if valid
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return true;
    
    const exp = payload.exp as number | undefined;
    if (!exp) return false; // No exp claim, assume valid
    
    // Convert exp to milliseconds and compare with current time
    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    
    // Add 30 second buffer to account for clock skew
    return currentTime >= (expirationTime - 30000);
  } catch (error) {
    return true; // Assume expired on error
  }
}

/**
 * Get time until token expiration in seconds
 * Returns negative if already expired
 */
export function getTokenTimeToExpiry(token: string): number {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return -1;
    
    const exp = payload.exp as number | undefined;
    if (!exp) return -1;
    
    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    
    return Math.floor((expirationTime - currentTime) / 1000);
  } catch (error) {
    return -1;
  }
}

/**
 * Should refresh token based on expiration time
 * Returns true if token should be refreshed (expiring soon or already expired)
 */
export function shouldRefreshToken(token: string): boolean {
  const timeToExpiry = getTokenTimeToExpiry(token);
  // Refresh if expiring in less than 5 minutes or already expired
  return timeToExpiry < 300;
}

/**
 * Clear all auth tokens from storage (logout)
 * This is a server-side function
 */
export async function clearServerTokens(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
  } catch (error) {
    // Silently handle errors
  }
}

/**
 * Enhanced auth headers with token refresh support
 * This function can be extended to implement automatic token refresh
 */
export async function getAuthHeadersWithRefresh(url: string): Promise<Record<string, string>> {
  // Skip auth headers for public endpoints
  if (isPublicEndpoint(url)) {
    return {};
  }
  
  // Get current token
  const token = await getServerAccessToken();
  
  if (!token) {
    return {};
  }
  
  // Check if token needs refresh
  if (shouldRefreshToken(token)) {
    // Token refresh could be implemented here
  }
  
  return getAuthHeader(token);
}

/**
 * Token refresh interface
 */
interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/**
 * Refresh access token using refresh token
 * This is a server-side function that should be called from server actions
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getServerRefreshToken();
    
    if (!refreshToken) {
      return null;
    }
    
    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      return null;
    }
    
    // Call refresh endpoint
    const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.auth.refreshToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json() as TokenRefreshResponse;
    
    // Update cookies with new tokens
    const cookieStore = await cookies();
    
    if (data.accessToken) {
      cookieStore.set(AUTH_TOKEN_COOKIE, data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }
    
    if (data.refreshToken) {
      cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }
    
    return data.accessToken;
  } catch (error) {
    return null;
  }
}