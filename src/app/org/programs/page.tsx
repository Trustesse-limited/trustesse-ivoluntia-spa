"use client"; 
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "./DashboardLayout";

// Icons for navigation links
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCast,
  FiStar,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdWifiTethering } from "react-icons/md";

// Define valid tab keys
type TabKey = "pending" | "active" | "history";

// Define structure of a program item
type ProgramItem = {
  title: string;
  description: string;
};

// Navigation links for the sidebar
const navLinks = [
  {
    label: "Dashboard",
    href: "/org/dashboard",
    icon: <FiHome className="text-black" />,
  },
  {
    label: "Programs",
    href: "/org/programs",
    icon: <FiCalendar className="text-black" />,
  },
  {
    label: "Volunteers",
    href: "/org/volunteers",
    icon: <FiUsers className="text-black" />,
  },
  {
    label: "Donations",
    href: "/org/donations",
    icon: <FaHandHoldingUsd className="text-black" />,
  },
  {
    label: "Broadcast",
    href: "/org/broadcast",
    icon: <MdWifiTethering className="text-black" />,
  },
  {
    label: "Reviews",
    href: "/org/reviews",
    icon: <FiStar className="text-black" />,
  },
  {
    label: "Help & Support",
    href: "/org/help",
    icon: <FiHelpCircle className="text-black" />,
  },
  {
    label: "Settings",
    href: "/org/settings",
    icon: <FiSettings className="text-black" />,
  },
];

// Dummy statistics data for display
const programStats = [
  { title: "Total Programs", value: 0, color: "bg-blue-500" },
  { title: "Active Programs", value: 0, color: "bg-green-500" },
  { title: "Pending Programs", value: 0, color: "bg-yellow-500" },
];

export default function ProgramsPage() {
  const router = useRouter();

  // State to track which tab is active
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  // Placeholder data structure for programs (can be replaced with API data)
  const programData: Record<TabKey, ProgramItem[]> = {
    pending: [],
    active: [],
    history: [],
  };

  // Tab definitions
  const tabs = [
    { key: "pending", label: "Pending Programs" },
    { key: "active", label: "Active Programs" },
    { key: "history", label: "History" },
  ];

  // Returns appropriate message when no programs are available
  const getEmptyMessage = () => {
    if (activeTab === "history") return "No history yet";
    return "You do not have any Programs. Create a program to start engaging volunteers and make an impact";
  };

  return (
    <DashboardLayout navLinks={navLinks} headerTitle="Organization Admin">
      <div>
        {/* Header section with title and create button */}
        <div className="flex items-center justify-between mb-6 w-full bg-white px-6 py-3">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Programs Management</h1>
            <p>Plan, publish and track programs in one place</p>
          </div>
          <button
            className="bg-[#0E68DC] text-white py-4 pl-6.5 rounded-md pr-7.5"
            onClick={() => router.push("/org/programs/create")}
          >
            <span className="pr-2">+</span> Create New Program
          </button>
        </div>

        {/* Program statistics cards */}
        <div className="flex justify-start items-center gap-6 px-6 w-full flex-wrap">
          {programStats.map((stat) => (
            <div
              key={stat.title}
              className={`p-4 rounded-lg shadow-md w-[273px] bg-white text-white mb-4`}
            >
              <h2 className="text-sm font-semibold text-[#818181] mb-9">
                {stat.title}
              </h2>
              <p className="text-[45px] font-semibold text-black">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabbed content section */}
        <div className="p-8 mx-6 bg-white w-full min-h-[400px]">
          {/* Tabs navigation */}
          <div className="flex space-x-8 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab.key
                    ? "text-[#42A5F5] border-b-2 border-[#42A5F5]"
                    : "text-[#818181] hover:text-[#42A5F5]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content display */}
          <div className="mt-16 flex justify-center items-center h-48 text-gray-400 italic text-center">
            {programData[activeTab].length === 0 ? (
              <p>{getEmptyMessage()}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {programData[activeTab].map((program, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded shadow text-gray-800"
                  >
                    <h3 className="font-semibold">{program.title}</h3>
                    <p className="text-sm">{program.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
