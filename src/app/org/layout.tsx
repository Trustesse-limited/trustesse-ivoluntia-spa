import { redirect } from 'next/navigation';
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { FiHome, FiBriefcase, FiUsers, FiHeart, FiRadio, FiStar, FiHelpCircle, FiSettings } from 'react-icons/fi';
import { requireRole } from '@/lib/auth.server';

const navLinks = [
  { label: 'Dashboard', href: '/org/dashboard', icon: <FiHome /> },
  { label: 'Programs', href: '/org/programs', icon: <FiBriefcase /> },
  { label: 'Volunteers', href: '/org/volunteers', icon: <FiUsers /> },
  { label: 'Donations', href: '/org/donations', icon: <FiHeart /> },
  { label: 'Broadcast', href: '/org/broadcast', icon: <FiRadio /> },
  { label: 'Reviews', href: '/org/reviews', icon: <FiStar /> },
  { label: 'Help & Support', href: '/org/help', icon: <FiHelpCircle /> },
  { label: 'Settings', href: '/org/settings', icon: <FiSettings /> },
];

async function OrganizationAuthWrapper({ children }: { children: React.ReactNode }) {
  try {
    await requireRole('organization');
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      redirect('/login');
    }
    throw error;
  }
  
  return <>{children}</>;
}

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrganizationAuthWrapper>
      <DashboardLayout
        navLinks={navLinks}
        headerTitle="Organization Admin"
        dashboardType="organization"
        userType="Admin"
      >
        {children}
      </DashboardLayout>
    </OrganizationAuthWrapper>
  );
}
