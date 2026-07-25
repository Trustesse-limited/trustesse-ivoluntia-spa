import { cookies } from 'next/headers';

// Server-side auth utilities for better security
export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function isAuthenticated() {
  const token = await getAuthToken();
  return !!token;
}

// Server-side session validation
export async function validateSession() {
  const token = await getAuthToken();
  
  if (!token) {
    return { valid: false, user: null };
  }

  try {
    // Validate token with backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/Auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, user: data.user };
    }

    return { valid: false, user: null };
  } catch (error) {
    console.error('Session validation failed:', error);
    return { valid: false, user: null };
  }
}
