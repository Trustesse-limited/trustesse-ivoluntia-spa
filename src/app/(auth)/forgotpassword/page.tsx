import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ForgotPasswordPageClient from './ForgotPasswordPageClient';

// Disable static generation to ensure fresh cookie reads
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function ForgotPasswordPageServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const hasCompletedOnboarding = cookieStore.get('has_completed_onboarding')?.value === 'true';
  const rawAccountType = cookieStore.get('user_role')?.value;
  // Normalize: "foundation" → "organization", super admin variants → "admin"
  const accountType = rawAccountType === 'foundation'
    ? 'organization'
    : rawAccountType === 'super_admin' || rawAccountType === 'superadmin' || rawAccountType === 'Super Admin' || rawAccountType === 'SuperAdmin'
      ? 'admin'
      : rawAccountType;

  // If user is authenticated, redirect based on onboarding status
  if (token) {
    if (!hasCompletedOnboarding) {
      redirect('/onboarding');
    } else {
      if (accountType === 'volunteer') {
        redirect('/home');
      } else if (accountType === 'organization') {
        redirect('/org/dashboard');
      } else if (accountType === 'admin') {
        redirect('/admin/dashboard');
      }
    }
  }

  return <ForgotPasswordPageClient />;
}

export default ForgotPasswordPageServer;
