import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import logger from '@/lib/logger';
import LoginPageClient from './LoginPageClient';

// Disable static generation to ensure fresh cookie reads
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function LoginPageServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const hasCompletedOnboarding = cookieStore.get('has_completed_onboarding')?.value === 'true';
  const accountType = cookieStore.get('user_role')?.value;
  
  logger.log('=== LOGIN PAGE SERVER-SIDE AUTH CHECK ===');
  logger.log('Token exists:', !!token);
  logger.log('User Role:', accountType);
  logger.log('Has Completed Onboarding:', hasCompletedOnboarding);
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
  
  return <LoginPageClient />;
}

export default LoginPageServer;