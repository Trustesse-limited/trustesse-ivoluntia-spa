'use client';

import React, { useState } from "react";
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiBarChart2, FiSettings } from 'react-icons/fi';
import DashboardLayout from "@/components/DashboardLayout";

const navLinks = [
  { label: 'Dashboard', href: '/admin-dashboard', icon: <FiHome /> },
  { label: 'Users', href: '/admin-users', icon: <FiUsers /> },
  { label: 'Organizations', href: '/admin-organizations', icon: <FiBriefcase /> },
  { label: 'Analytics', href: '/admin-analytics', icon: <FiBarChart2 /> },
  { label: 'Settings', href: '/admin-settings', icon: <FiSettings /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const searchBar = (
    <div className="relative bg-[#F0F4F8] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500   focus:border-transparent">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-[#F0F4F8] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500   focus:border-transparent pr-4 py-3 text-sm w-full sm:w-80 md:w-96"
      />
    </div>
  );

  return (
    <DashboardLayout 
      navLinks={navLinks} 
      dashboardType="admin"
      searchBar={searchBar}
      userType="Super Admin"
    >
      {children}
    </DashboardLayout>
  );
}
