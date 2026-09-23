import { cookies } from 'next/headers';

export type UserRole = 'volunteer' | 'organization' | 'admin' | 'foundation' | null;

export interface AuthInfo {
  isAuthenticated: boolean;
  userRole: UserRole;
  token: string | null;
}

/**
 * Unified server-side authentication check
 * Reads from HTTP-only cookies and returns normalized auth info
 */
export async function getServerAuthInfo(): Promise<AuthInfo> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const userRole = cookieStore.get('user_role')?.value;

  const isAuthenticated = !!token;
  let normalizedRole = userRole?.toLowerCase() as UserRole || null;
  
  // Normalize "foundation" to "organization" - they are interchangeable
  if (normalizedRole === 'foundation') {
    normalizedRole = 'organization';
  }

  return {
    isAuthenticated,
    userRole: normalizedRole,
    token: token || null,
  };
}

/**
 * Check if user is authenticated with a specific role
 * Handles normalization of "foundation" to "organization"
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const authInfo = await getServerAuthInfo();
  // Normalize the requested role too in case it's "foundation"
  const normalizedRequestedRole = role === 'foundation' ? 'organization' : role;
  return authInfo.isAuthenticated && authInfo.userRole === normalizedRequestedRole;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthInfo> {
  const authInfo = await getServerAuthInfo();
  
  if (!authInfo.isAuthenticated) {
    throw new Error('UNAUTHORIZED');
  }
  
  return authInfo;
}

/**
 * Require specific role - redirects if user doesn't have the required role
 * Handles normalization of "foundation" to "organization"
 */
export async function requireRole(role: UserRole): Promise<AuthInfo> {
  const authInfo = await requireAuth();
  
  // Normalize the requested role in case it's "foundation"
  const normalizedRequestedRole = role === 'foundation' ? 'organization' : role;
  
  if (authInfo.userRole !== normalizedRequestedRole) {
    throw new Error('FORBIDDEN');
  }
  
  return authInfo;
}
