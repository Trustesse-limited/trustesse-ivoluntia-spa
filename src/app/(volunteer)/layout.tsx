import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { FiHome, FiHeart, FiStar, FiUser, FiBell, FiSettings } from 'react-icons/fi';
import { requireRoleOrRedirect } from '@/lib/auth.server';

const navLinks = [
  { label: 'Home', href: '/home', icon: <FiHome /> },
  { label: 'Favourites', href: '/favourites', icon: <FiHeart /> },
  { label: 'Achievements', href: '/achievements', icon: <FiStar /> },
  { label: 'Profile', href: '/profile', icon: <FiUser /> },
  { label: 'Notifications', href: '/notifications', icon: <FiBell /> },
  { label: 'Settings', href: '/settings', icon: <FiSettings /> },
];

async function VolunteerAuthWrapper({ children }: { children: React.ReactNode }) {
  // Server-side guard: volunteer accounts only. Other roles are redirected
  // to their own dashboard, unauthenticated users to /login.
  await requireRoleOrRedirect('volunteer');

  return <>{children}</>;
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <VolunteerAuthWrapper>
      <DashboardLayout
        navLinks={navLinks}
        headerTitle="Volunteer Dashboard"
        dashboardType="volunteer"
        userType="Volunteer"
      >
        {children}
      </DashboardLayout>
    </VolunteerAuthWrapper>
  );
}
