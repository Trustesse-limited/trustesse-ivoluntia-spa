import DashboardLayout from '@/components/DashboardLayout';
import { requireRoleOrRedirect } from '@/lib/auth.server';
import { FiHome, FiUser, FiActivity, FiHeart, FiAward, FiSettings, FiBell, FiHelpCircle } from 'react-icons/fi';

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
  // Server-side guard: volunteers only. Other roles are redirected
  // to their own dashboard, unauthenticated users to /login.
  await requireRoleOrRedirect('volunteer');

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
