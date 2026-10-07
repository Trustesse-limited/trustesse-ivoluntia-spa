import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/lib/logger';

type Role = 'volunteer' | 'organization' | 'admin';

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/forgotpassword',
  '/resetpassword',
  '/verify',
];

// Role-based route groups.
// Each top-level app route is owned by exactly one role.
// IMPORTANT: when adding a new top-level route, add it here so the
// cross-role guard can block users of other roles from it.
const roleRouteGroups: Record<Role, string[]> = {
  volunteer: [
    '/home',
    '/profile',
    '/activity',
    '/favourites',
    '/achievements',
    '/settings',
    '/notifications',
    '/legal-support',
    '/programs',
  ],
  organization: ['/org'],
  admin: ['/admin'],
};

// Dashboard ("home") route per role
const roleHome: Record<Role, string> = {
  volunteer: '/home',
  organization: '/org/dashboard',
  admin: '/admin/dashboard',
};

// Section index routes that have no page of their own (e.g. /org, /admin)
// redirect to the role's dashboard instead of rendering a 404.
const sectionIndexRedirects: Record<string, string> = {
  '/org': '/org/dashboard',
  '/admin': '/admin/dashboard',
};

// Routes that require authentication (all role routes + onboarding)
const protectedRoutes = ['/onboarding', ...Object.values(roleRouteGroups).flat()];

/**
 * Normalize the raw user_role cookie value to one of the three roles.
 * - "foundation" and "organization" are interchangeable
 * - "super_admin"/"superadmin" are admin accounts
 * Returns null for missing/unknown values.
 */
function normalizeRole(raw?: string): Role | null {
  if (!raw) return null;
  const value = raw.toLowerCase().replace(/\s+/g, '_');
  if (value === 'volunteer') return 'volunteer';
  if (value === 'organization' || value === 'foundation') return 'organization';
  if (value === 'admin' || value === 'super_admin' || value === 'superadmin') return 'admin';
  return null;
}

// Check if a pathname matches a route prefix (exact route or a child of it)
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies (check both auth_token and access_token)
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('access_token')?.value;
  const hasCompletedOnboarding = request.cookies.get('has_completed_onboarding')?.value === 'true';
  const accountType = normalizeRole(request.cookies.get('user_role')?.value);

  logger.log('=== MIDDLEWARE ===');
  logger.log('Pathname:', pathname);
  logger.log('Auth Token exists:', !!token);
  logger.log('Normalized Role:', accountType || 'NONE');
  logger.log('Has Completed Onboarding:', hasCompletedOnboarding);

  // 1. Public auth pages (login, signup, ...) are always reachable
  if (matchesRoute(pathname, publicRoutes)) {
    logger.log('ALLOWING: public route');
    return NextResponse.next();
  }

  const isProtected = matchesRoute(pathname, protectedRoutes);

  // 2. Protected route without a session → send to login with a callback
  if (isProtected && !token) {
    logger.log('BLOCKING: no token for protected route, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Unauthenticated request to a non-protected route: let Next.js resolve it.
  //    If no page exists for this path, the not-found (404) page is rendered.
  if (!token) {
    logger.log('ALLOWING: unauthenticated request to non-protected route');
    return NextResponse.next();
  }

  // --- From here on the user is authenticated ---

  // 4. Onboarding is role-neutral: every role can reach it
  if (matchesRoute(pathname, ['/onboarding'])) {
    if (hasCompletedOnboarding) {
      logger.log('Onboarding already completed, redirecting to dashboard');
      return NextResponse.redirect(new URL(accountType ? roleHome[accountType] : '/', request.url));
    }
    logger.log('ALLOWING: onboarding in progress');
    return NextResponse.next();
  }

  // 5. Find which role owns this route
  const owningRole = (Object.keys(roleRouteGroups) as Role[]).find((role) =>
    matchesRoute(pathname, roleRouteGroups[role])
  );

  if (owningRole) {
    // CROSS-ROLE GUARD: a volunteer must never see /org or /admin routes,
    // an organization must never see volunteer or admin routes, etc.
    if (accountType && owningRole !== accountType) {
      logger.log(`BLOCKING: ${accountType} tried to access ${owningRole} route, redirecting to own dashboard`);
      return NextResponse.redirect(new URL(roleHome[accountType], request.url));
    }

    // Token exists but no recognizable role → back to the landing page
    if (!accountType) {
      logger.log('BLOCKING: token exists but role is unknown, redirecting to landing page');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Section index route without its own page (e.g. /org, /admin)
    const indexRedirect = sectionIndexRedirects[pathname];
    if (indexRedirect) {
      logger.log(`Redirecting section index ${pathname} to ${indexRedirect}`);
      return NextResponse.redirect(new URL(indexRedirect, request.url));
    }

    logger.log('ALLOWING: route belongs to user role');
    return NextResponse.next();
  }

  // 6. Root: authenticated users get an instant redirect to onboarding/dashboard
  // (the root page would only emit a meta-refresh fallback because the response
  // stream starts before its server code finishes)
  if (pathname === '/') {
    if (token && !hasCompletedOnboarding) {
      logger.log('Root: onboarding not completed, redirecting to onboarding');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (token && accountType) {
      logger.log(`Root: redirecting ${accountType} to dashboard`);
      return NextResponse.redirect(new URL(roleHome[accountType], request.url));
    }
    // Not authenticated (or token without a known role) → landing page
    logger.log('ALLOWING: root route');
    return NextResponse.next();
  }

  // 7. Not a known application route → let Next.js resolve it.
  //    Non-existent paths render the not-found (404) page for every visitor,
  //    authenticated or not. This keeps the 404 page exclusively for
  //    genuinely missing routes while the role guards above handle real routes.
  logger.log('ALLOWING: unknown path, Next.js will render 404 if it does not exist');
  logger.log('=================\n');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
