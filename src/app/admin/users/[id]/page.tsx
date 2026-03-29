"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit, FiMail, FiPhone, FiCalendar, FiShield, FiActivity, FiSettings, FiUser, FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1-555-0123",
    role: "Admin",
    status: "active",
    joined: "Jan 15, 2024",
    lastActive: "2 hours ago",
    profileImage: "/api/placeholder/150/150",
    bio: "Experienced administrator with a passion for community service and volunteer management.",
    location: "New York, NY",
    department: "Administration",
    skills: ["Leadership", "Communication", "Project Management"],
    achievements: ["Top Performer 2024", "100+ Hours Volunteered"],
    activity: [
      { date: "2024-03-29", action: "Updated user profile", time: "2 hours ago" },
      { date: "2024-03-28", action: "Completed training module", time: "1 day ago" },
      { date: "2024-03-27", action: "Joined volunteer program", time: "2 days ago" },
    ]
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1-555-0124",
    role: "Volunteer",
    status: "active",
    joined: "Feb 20, 2024",
    lastActive: "1 day ago",
    profileImage: "/api/placeholder/150/150",
    bio: "Dedicated volunteer focused on environmental conservation and community outreach.",
    location: "San Francisco, CA",
    department: "Volunteer Services",
    skills: ["Environmental Science", "Teaching", "Public Speaking"],
    achievements: ["Volunteer of the Month", "50+ Hours Volunteered"],
    activity: [
      { date: "2024-03-28", action: "Participated in cleanup event", time: "1 day ago" },
      { date: "2024-03-25", action: "Completed orientation", time: "4 days ago" },
    ]
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "+1-555-0125",
    role: "Organization Manager",
    status: "inactive",
    joined: "Mar 10, 2024",
    lastActive: "3 days ago",
    profileImage: "/api/placeholder/150/150",
    bio: "Organization manager with expertise in program coordination and team leadership.",
    location: "Chicago, IL",
    department: "Program Management",
    skills: ["Program Coordination", "Team Leadership", "Event Planning"],
    achievements: ["Program Excellence Award", "Managed 10+ Programs"],
    activity: [
      { date: "2024-03-26", action: "Updated program details", time: "3 days ago" },
      { date: "2024-03-24", action: "Completed team training", time: "5 days ago" },
    ]
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@example.com",
    phone: "+1-555-0126",
    role: "Volunteer",
    status: "active",
    joined: "Apr 5, 2024",
    lastActive: "5 minutes ago",
    profileImage: "/api/placeholder/150/150",
    bio: "Passionate volunteer dedicated to community service and making a positive impact.",
    location: "Seattle, WA",
    department: "Volunteer Services",
    skills: ["Community Service", "Mentoring", "Youth Development"],
    achievements: ["Rising Star Award", "25+ Hours Volunteered"],
    activity: [
      { date: "2024-03-29", action: "Completed volunteer shift", time: "5 minutes ago" },
      { date: "2024-03-28", action: "Signed up for new program", time: "1 day ago" },
    ]
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    phone: "+1-555-0127",
    role: "Admin",
    status: "active",
    joined: "Feb 15, 2024",
    lastActive: "2 hours ago",
    profileImage: "/api/placeholder/150/150",
    bio: "Senior administrator with extensive experience in system management and user support.",
    location: "Boston, MA",
    department: "Administration",
    skills: ["System Administration", "User Support", "Data Management"],
    achievements: ["Admin Excellence Award", "System Optimization Leader"],
    activity: [
      { date: "2024-03-29", action: "Updated system settings", time: "2 hours ago" },
      { date: "2024-03-28", action: "Resolved user tickets", time: "1 day ago" },
    ]
  },
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  // Find user by ID
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4"
      >
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-[#0E68DC] text-white rounded-md hover:opacity-90 transition"
          >
            Back to Users
          </button>
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-800";
      case "Organization Manager": return "bg-blue-100 text-blue-800";
      case "Volunteer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "activity", label: "Activity" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/users")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            User Details
          </h1>
          <p className="text-sm text-black break-words">
            View and manage user information
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E68DC] text-sm text-white rounded-md hover:opacity-90 transition cursor-pointer">
          <FiEdit className="w-4 h-4" />
          Edit User
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.name}</h2>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{user.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBriefcase className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Joined {user.joined}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Last active {user.lastActive}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* Tabs Navigation */}
        <div className="relative mb-6">
          <div className="max-sm:w-[80vw] w-full relative">
            <div className="flex w-full max-sm:gap-4 gap-6 border-b max-sm:overflow-x-auto scrollbar-hide whitespace-nowrap border-gray-200 px-4 sm:px-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 text-[14px] cursor-pointer font-medium transition border-b-2 w-fit ${
                    activeTab === tab.key
                      ? "text-[#0E68DC] border-[#42A5F5]"
                      : "text-black border-transparent hover:text-[#0E68DC]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
              <div className="space-y-2">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiShield className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {user.activity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <FiActivity className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">User Settings</h3>
            
            {/* Account Settings */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Account Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive email updates</p>
                  </div>
                  <button className="w-12 h-6 bg-blue-500 rounded-full relative transition-colors">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-xs text-gray-500">Make profile public</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors">
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Security</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500">Update user password</p>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Enable 2FA for security</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
