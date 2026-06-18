'use server';

import { cookies } from 'next/headers';

// Server actions for cookie management (can be called from client components)
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return { success: true };
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return { token };
}

export async function setUserRoleCookie(role: string) {
  const cookieStore = await cookies();
  cookieStore.set('user_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return { success: true };
}

export async function removeUserRoleCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('user_role');
  return { success: true };
}
