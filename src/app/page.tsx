import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import logger from '@/lib/logger';
import RootPageClient from '@/app/RootPageClient';

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const hasCompletedOnboarding = cookieStore.get('has_completed_onboarding')?.value === 'true';
  const accountType = cookieStore.get('user_role')?.value;
  const lastCompletedPage = cookieStore.get('last_completed_page')?.value || '0';
  
  logger.log('=== ROOT PAGE SERVER-SIDE AUTH CHECK ===');
  logger.log('Token exists:', !!token);
  logger.log('User Role:', accountType);
  logger.log('Has Completed Onboarding:', hasCompletedOnboarding);
  logger.log('Last Completed Page:', lastCompletedPage);
  logger.log('========================================');
  
  // If user is authenticated, redirect based on onboarding status
  if (token) {
    if (!hasCompletedOnboarding) {
      logger.log('Redirecting to onboarding (not completed)');
      redirect('/onboarding');
    } else {
      logger.log('Redirecting to dashboard based on account type:', accountType);
      if (accountType === 'volunteer') {
        redirect('/home');
      } else if (accountType === 'organization') {
        redirect('/org/dashboard');
      } else if (accountType === 'admin') {
        redirect('/admin/dashboard');
      }
    }
  }
  
  // If not authenticated, show the landing page
  return <RootPageClient />;
}

export default Page;
