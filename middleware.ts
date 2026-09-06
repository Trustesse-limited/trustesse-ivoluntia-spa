import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function for production-safe logging in middleware
const middlewareLogger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log(...args);
    }
  }
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgotpassword',
  '/resetpassword',
  '/verify',
];

// Role-based route groups
const roleRouteGroups = {
  volunteer: ['/home', '/profile', '/activity', '/favourites', '/achievements', '/settings'],
  organization: ['/dashboard', '/org-profile', '/campaigns', '/events', '/org-settings'],
  admin: ['/admin-dashboard', '/admin-users', '/admin-organizations', '/admin-analytics', '/admin-settings'],
};

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/home',
  '/profile',
  '/activity',
  '/favourites',
  '/achievements',
  '/settings',
  '/org-profile',
  '/campaigns',
  '/events',
  '/org-settings',
  '/admin-dashboard',
  '/admin-users',
  '/admin-organizations',
  '/admin-analytics',
  '/admin-settings',
  '/volunteer',
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
  
  console.log('=== MIDDLEWARE AUTHENTICATION CHECK ===');
  console.log('📍 Pathname:', pathname);
  console.log('🍪 All Cookies:', cookieNames || 'NONE');
  console.log('🔑 Auth Token exists:', !!token);
  console.log('🔑 Auth Token value:', token ? `${token.substring(0, 20)}...` : 'NONE');
  console.log('👤 User Role:', accountType || 'NONE');
  console.log('✅ Has Completed Onboarding:', hasCompletedOnboarding);
  console.log('🔒 Protected Routes:', protectedRoutes.join(', '));
  console.log('🔒 Is Protected Route:', protectedRoutes.some(route => pathname.startsWith(route)));
  console.log('🔓 Public Routes:', publicRoutes.join(', '));
  console.log('🔓 Auth Routes:', authRoutes.join(', '));
  console.log('========================================');
  
  // If trying to access protected route without token, redirect to login
  // Exception: Allow authenticated users to access onboarding even if it's in protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    console.log('🚫 BLOCKING: No token for protected route, redirecting to login');
    console.log('🚫 Protected route accessed:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Special handling for onboarding: allow authenticated users who haven't completed onboarding
  if (pathname.startsWith('/onboarding') && token) {
    console.log('🔐 Checking onboarding access');
    if (hasCompletedOnboarding) {
      console.log('🔄 User has completed onboarding, redirecting to dashboard');
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else if (accountType === 'admin') {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      }
    } else {
      console.log('✅ ALLOWING: User can access onboarding (not completed yet)');
      return NextResponse.next();
    }
  }
  
  console.log('✅ Token present, checking route access...');
  
  // If authenticated and trying to access auth routes, redirect based on onboarding status
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    console.log('🔄 Authenticated user accessing auth route');
    if (!hasCompletedOnboarding) {
      console.log('🔄 Redirecting to onboarding (not completed)');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      console.log('🔄 Redirecting to dashboard based on account type:', accountType);
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      }
    }
  }
  
  // If authenticated and accessing root route, redirect based on onboarding status
  if (token && pathname === '/') {
    console.log('🔄 Authenticated user accessing root route');
    if (!hasCompletedOnboarding) {
      console.log('🔄 Redirecting to onboarding (not completed)');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      console.log('🔄 Redirecting to dashboard based on account type:', accountType);
      if (accountType === 'volunteer') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (accountType === 'organization') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      }
    }
  }
  
  // Role-based access control for protected routes (excluding onboarding)
  if (token && protectedRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/onboarding')) {
    console.log('🔐 Checking role-based access for:', pathname);
    console.log('👤 User account type:', accountType);
    if (accountType) {
      // Check if user can access this route based on role
      const allowedRoutes = roleRouteGroups[accountType as keyof typeof roleRouteGroups];
      console.log('✅ Allowed routes for role:', allowedRoutes?.join(', ') || 'NONE');
      const canAccess = allowedRoutes?.some((route: string) => 
        pathname === route || pathname.startsWith(route + '/')
      );
      console.log('🔍 Can access route:', canAccess);
      
      // If user has a role but can't access this route, redirect to their appropriate dashboard
      if (!canAccess) {
        console.log('🚫 BLOCKING: User role cannot access this route');
        console.log('🚫 Redirecting to appropriate dashboard for role:', accountType);
        if (accountType === 'volunteer') {
          return NextResponse.redirect(new URL('/home', request.url));
        } else if (accountType === 'organization') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (accountType === 'admin') {
          return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        }
      } else {
        console.log('✅ ALLOWING: User has access to this route');
      }
    } else {
      console.log('⚠️ WARNING: Token exists but no account type found');
    }
  }
  
  console.log('✅ ALLOWING: Request proceeding to page');
  console.log('========================================\n');
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
