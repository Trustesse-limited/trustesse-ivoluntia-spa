/**
 * Client-side Auth Configuration
 * 
 * NOTE: This application uses PURE SERVER-SIDE AUTH for maximum security.
 * JWT tokens are stored exclusively in HTTP-only cookies and are never accessible to client-side JavaScript.
 * 
 * This file provides configuration utilities for client-side API calls to work with cookie-based authentication.
 * No tokens are stored in localStorage or exposed to client-side code.
 */

import { API_ENDPOINTS } from './api-config';

/**
 * Public API endpoints that should not include credentials
 * These endpoints are used for authentication operations before a user has a token
 */
const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.auth.volunteerSignup,
  API_ENDPOINTS.auth.organizationSignup,
  '/api/v1/Auth/confirmuser',
  API_ENDPOINTS.otp.resend,
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.resetPassword,
  '/api/v1/countries/countries',
  '/api/v1/countries/states',
];

/**
 * Check if a URL is a public endpoint that should not include credentials
 */
export function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

/**
 * Get axios configuration for cookie-based authentication
 * This enables credentials to be sent with requests for cookie-based auth
 */
export function getCookieAuthConfig(url: string): { withCredentials: boolean } {
  // Skip credentials for public endpoints
  if (isPublicEndpoint(url)) {
    return { withCredentials: false };
  }
  
  // Include credentials (cookies) for authenticated endpoints
  return { withCredentials: true };
}

/**
 * NOTE: The following functions are intentionally NOT implemented
 * for security reasons. This application uses pure server-side auth.
 * 
 * - No token storage in localStorage
 * - No token exposure to client-side JavaScript
 * - All token management happens server-side via HTTP-only cookies
 * 
 * If you need client-side authentication state, use server actions
 * or server components to check authentication status.
 */