import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/lib/logger';

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/forgotpassword',
  '/resetpassword',
  '/verify',
];

// Role-based route groups
const roleRouteGroups = {
  volunteer: ['/home', '/profile', '/activity', '/favourites', '/achievements', '/settings', '/notifications', '/legal-support'],
  organization: ['/org'],
  admin: ['/admin'],
};

// Protected routes that require authentication
const protectedRoutes = [
  '/home',
  '/profile',
  '/activity',
  '/favourites',
  '/achievements',
  '/settings',
  '/notifications',
  '/legal-support',
  '/org',
  '/admin',
  '/onboarding',
];

// Auth routes (login, signup, etc.)
const authRoutes = ['/login', '/signup', '/forgotpassword', '/resetpassword', '/verify'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies (check both auth_token and access_token)
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('access_token')?.value;
  const hasCompletedOnboarding = request.cookies.get('has_completed_onboarding')?.value === 'true';
  const accountType = request.cookies.get('user_role')?.value;
  
  // Log all cookies for debugging
  const allCookies = request.cookies.getAll();
  const cookieNames = allCookies.map(c => c.name).join(', ');
  
  logger.log('=== MIDDLEWARE AUTHENTICATION CHECK ===');
  logger.log('Pathname:', pathname);
  logger.log('Pathname === "/":', pathname === '/');
  logger.log('All Cookies:', cookieNames || 'NONE');
  logger.log('Auth Token exists:', !!token);
  logger.log('Auth Token value:', token ? `${token.substring(0, 20)}...` : 'NONE');
  logger.log('User Role:', accountType || 'NONE');
  logger.log('Has Completed Onboarding:', hasCompletedOnboarding);
  logger.log('Protected Routes:', protectedRoutes.join(', '));
  logger.log('Is Protected Route:', protectedRoutes.some(route => pathname.startsWith(route)));
  logger.log('Public Routes:', publicRoutes.join(', '));
  logger.log('Auth Routes:', authRoutes.join(', '));
  logger.log('Is Public Route:', publicRoutes.includes(pathname));
  logger.log('Is Auth Route:', authRoutes.some(route => pathname.startsWith(route)));
  logger.log('========================================');
  
  // If trying to access protected route without token, redirect to login
  // Exception: Allow authenticated users to access onboarding even if it's in protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    logger.log('BLOCKING: No token for protected route, redirecting to login');
    logger.log('Protected route accessed:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Special handling for onboarding: allow authenticated users who haven't completed onboarding
  if (pathname.startsWith('/onboarding') && token) {
    logger.log('Checking onboarding access');
    if (hasCompletedOnboarding) {
      logger.log('User has completed onboarding, redirecting to dashboard');
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/org/dashboard', request.url));
      } else if (accountType === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } else {
      logger.log('ALLOWING: User can access onboarding (not completed yet)');
      return NextResponse.next();
    }
  }
  
  logger.log('Token present, checking route access...');
  
  // If authenticated and trying to access auth routes, redirect based on onboarding status
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    logger.log('Authenticated user accessing auth route');
    if (!hasCompletedOnboarding) {
      logger.log('Redirecting to onboarding (not completed)');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      logger.log('Redirecting to dashboard based on account type:', accountType);
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/org/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }
  
  // If authenticated and accessing root route, redirect based on onboarding status
  if (token && pathname === '/') {
    logger.log('Authenticated user accessing root route');
    if (!hasCompletedOnboarding) {
      logger.log('Redirecting to onboarding (not completed)');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      logger.log('Redirecting to dashboard based on account type:', accountType);
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/org/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }
  
  // Catch-all for authenticated users: redirect to appropriate route based on onboarding status
  // This handles cases where user visits any route that's not a protected route they can access
  if (token && !publicRoutes.includes(pathname) && !protectedRoutes.some(route => pathname.startsWith(route))) {
    logger.log('Authenticated user accessing non-protected route:', pathname);
    if (!hasCompletedOnboarding) {
      logger.log('Redirecting to onboarding (not completed)');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      logger.log('Redirecting to dashboard based on account type:', accountType);
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/org/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }
  
  // Role-based access control for protected routes (excluding onboarding)
  if (token && protectedRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/onboarding')) {
    logger.log('Checking role-based access for:', pathname);
    logger.log('User account type:', accountType);
    if (accountType) {
      // Check if user can access this route based on role
      const allowedRoutes = roleRouteGroups[accountType as keyof typeof roleRouteGroups];
      logger.log('Allowed routes for role:', allowedRoutes?.join(', ') || 'NONE');
      const canAccess = allowedRoutes?.some((route: string) => 
        pathname === route || pathname.startsWith(route + '/')
      );
      logger.log('Can access route:', canAccess);
      
      // If user has a role but can't access this route, redirect to their appropriate dashboard
      if (!canAccess) {
        logger.log('BLOCKING: User role cannot access this route');
        logger.log('Redirecting to appropriate dashboard for role:', accountType);
        if (accountType === 'volunteer') {
          return NextResponse.redirect(new URL('/home', request.url));
        } else if (accountType === 'organization') {
          return NextResponse.redirect(new URL('/org/dashboard', request.url));
        } else if (accountType === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      } else {
        logger.log('ALLOWING: User has access to this route');
      }
    } else {
      logger.log('WARNING: Token exists but no account type found');
    }
  }
  
  logger.log('ALLOWING: Request proceeding to page');
  logger.log('========================================\n');
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
