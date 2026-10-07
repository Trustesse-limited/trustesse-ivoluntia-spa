import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  const rawRole = userRole?.toLowerCase().replace(/\s+/g, '_') || null;
  let normalizedRole: UserRole = rawRole as UserRole;
  
  // Normalize "foundation" to "organization" - they are interchangeable
  if (rawRole === 'foundation') {
    normalizedRole = 'organization';
  }

  // Normalize super admin variants to "admin"
  if (rawRole === 'super_admin' || rawRole === 'superadmin') {
    normalizedRole = 'admin';
  }

  return {
    isAuthenticated,
    userRole: normalizedRole,
    token: token || null,
  };
}

/**
 * Dashboard ("home") route for each role.
 * Unknown roles fall back to the landing page.
 */
export function getRoleHome(role: UserRole): string {
  switch (role) {
    case 'volunteer':
      return '/home';
    case 'organization':
      return '/org/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
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

/**
 * Layout guard: requires auth + role, redirecting instead of throwing.
 * - Not signed in → /login
 * - Signed in with a different role → their own dashboard
 *   (a user is never shown a route that belongs to another account type)
 */
export async function requireRoleOrRedirect(role: UserRole): Promise<void> {
  try {
    await requireRole(role);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      redirect('/login');
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      const { userRole } = await getServerAuthInfo();
      redirect(getRoleHome(userRole));
    }
    throw error;
  }
}
