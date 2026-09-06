import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OnboardingClient from './OnboardingClient';

async function OnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const hasCompletedOnboarding = cookieStore.get('has_completed_onboarding')?.value === 'true';
  const userRole = cookieStore.get('user_role')?.value;
  
  console.log('=== ONBOARDING PAGE SERVER-SIDE AUTH CHECK ===');
  console.log('🔑 Token exists:', !!token);
  console.log('👤 User Role:', userRole);
  console.log('✅ Has Completed Onboarding:', hasCompletedOnboarding);
  console.log('========================================');
  
  // Only redirect if no token - let middleware handle the onboarding completion redirect
  if (!token) {
    console.log('� No token found in onboarding page, redirecting to login');
    redirect('/login');
  }
  
  return <OnboardingClient />;
}

export default OnboardingPage;