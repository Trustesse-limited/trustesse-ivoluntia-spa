import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OnboardingClient from './OnboardingClient';

// Disable static generation to ensure fresh cookie reads
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function OnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const hasCompletedOnboarding = cookieStore.get('has_completed_onboarding')?.value === 'true';
  const userRole = cookieStore.get('user_role')?.value;

  // Only redirect if no token - let middleware handle the onboarding completion redirect
  if (!token) {
    redirect('/login');
  }

  // If onboarding is complete, redirect to appropriate dashboard
  if (hasCompletedOnboarding) {
    if (userRole === 'organization') {
      redirect('/org/dashboard');
    } else {
      redirect('/home');
    }
  }

  return <OnboardingClient accountTypeFromCookie={userRole} />;
}

export default OnboardingPage;