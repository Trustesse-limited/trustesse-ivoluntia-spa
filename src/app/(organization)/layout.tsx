import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { FiHome, FiUser, FiBriefcase, FiCalendar, FiSettings } from 'react-icons/fi';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
  { label: 'Profile', href: '/org-profile', icon: <FiUser /> },
  { label: 'Campaigns', href: '/campaigns', icon: <FiBriefcase /> },
  { label: 'Events', href: '/events', icon: <FiCalendar /> },
  { label: 'Settings', href: '/org-settings', icon: <FiSettings /> },
];

async function OrganizationAuthWrapper({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || cookieStore.get('access_token')?.value;
  const userRole = cookieStore.get('user_role')?.value;
  
  console.log('=== ORGANIZATION LAYOUT SERVER-SIDE AUTH CHECK ===');
  console.log('🔑 Token exists:', !!token);
  console.log('👤 User Role:', userRole);
  console.log('========================================');
  
  if (!token) {
    console.log('🚫 No token found in organization layout, redirecting to login');
    redirect('/login');
  }
  
  if (userRole !== 'organization') {
    console.log('🚫 User is not organization, redirecting to login');
    redirect('/login');
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
