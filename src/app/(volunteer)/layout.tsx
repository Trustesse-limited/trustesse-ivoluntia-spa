import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { FiHome, FiUser, FiActivity, FiHeart, FiAward, FiSettings, FiBell, FiHelpCircle } from 'react-icons/fi';
import { requireRole } from '@/lib/auth.server';

const navLinks = [
  { label: 'Home', href: '/home', icon: <FiHome /> },
  { label: 'Profile', href: '/profile', icon: <FiUser /> },
  { label: 'Activity', href: '/activity', icon: <FiActivity /> },
  { label: 'Achievements', href: '/achievements', icon: <FiAward /> },
  { label: 'Favourites', href: '/favourites', icon: <FiHeart /> },
  { label: 'Settings', href: '/settings', icon: <FiSettings />, isBottom: true },
  { label: 'Notifications', href: '/notifications', icon: <FiBell />, isBottom: true },
  { label: 'Legal & Support', href: '/legal-support', icon: <FiHelpCircle />, isBottom: true },
];

async function VolunteerAuthWrapper({ children }: { children: React.ReactNode }) {
  try {
    await requireRole('volunteer');
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      redirect('/login');
    }
    throw error;
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
