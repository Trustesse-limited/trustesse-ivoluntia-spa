import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { FiHome, FiUser, FiActivity, FiHeart, FiAward, FiSettings } from 'react-icons/fi';
import logger from '@/lib/logger';

const navLinks = [
  { label: 'Home', href: '/home', icon: <FiHome /> },
  { label: 'Profile', href: '/profile', icon: <FiUser /> },
  { label: 'Activity', href: '/activity', icon: <FiActivity /> },
  { label: 'Favourites', href: '/favourites', icon: <FiHeart /> },
  { label: 'Achievements', href: '/achievements', icon: <FiAward /> },
  { label: 'Settings', href: '/settings', icon: <FiSettings /> },
];

async function VolunteerAuthWrapper({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const userRole = cookieStore.get('user_role')?.value;
  
  logger.log('=== VOLUNTEER LAYOUT SERVER-SIDE AUTH CHECK ===');
  logger.log('Token exists:', !!token);
  logger.log('User Role:', userRole);
  logger.log('========================================');
  
  if (!token) {
    logger.log('No token found in volunteer layout, redirecting to login');
    redirect('/login');
  }
  
  if (userRole !== 'volunteer') {
    logger.log('User is not volunteer, redirecting to login');
    redirect('/login');
  }
  
  return <>{children}</>;
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <VolunteerAuthWrapper>
      <DashboardLayout
        navLinks={navLinks}
        headerTitle=""
        dashboardType="volunteer"
        userType="Volunteer"
      >
        {children}
      </DashboardLayout>
    </VolunteerAuthWrapper>
  );
}
