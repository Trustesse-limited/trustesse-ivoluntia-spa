import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/forgotpassword',
  '/resetpassword',
  '/auth',
  '/onboarding/signup',
];

// Role-based protected routes
const roleRoutes = {
  volunteer: ['/volunteer'],
  organization: ['/org'],
  admin: ['/admin'],
  super_admin: ['/admin'],
};

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/volunteer',
  '/org',
  '/admin',
  '/onboarding/volunteer',
  '/onboarding/org',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Check if the route is public or protected
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Pathname:', pathname);
  console.log('Token exists:', !!token);
  console.log('Token value:', token ? token.substring(0, 20) + '...' : 'none');
  console.log('Is public route:', isPublicRoute);
  console.log('Is protected route:', isProtectedRoute);
  console.log('========================');
  
  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('BLOCKING: No token for protected route, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If trying to access login/signup while authenticated, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/forgotpassword' || pathname.startsWith('/onboarding/signup'))) {
    console.log('REDIRECTING: Authenticated user accessing auth pages, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Role-based access control
  if (token && isProtectedRoute) {
    // Get user role from cookie (if available)
    const userRole = request.cookies.get('user_role')?.value;
    console.log('User role from cookie:', userRole);
    
    // Check if user can access this route based on role
    if (userRole) {
      const canAccess = Object.entries(roleRoutes).some(([role, routes]) => {
        if (role === userRole) {
          return routes.some(route => pathname.startsWith(route));
        }
        return false;
      });
      
      // If user has a role but can't access this route, redirect to their dashboard
      if (!canAccess && pathname !== '/dashboard') {
        console.log('BLOCKING: User role cannot access this route, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }
  
  console.log('ALLOWING: Request proceeding');
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
