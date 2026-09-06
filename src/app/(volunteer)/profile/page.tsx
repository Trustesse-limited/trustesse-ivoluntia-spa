"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  FiUser, 
  FiDollarSign, 
  FiClock, 
  FiAward, 
  FiHeart,
  FiSearch,
  FiFilter,
  FiPlus,
  FiSettings,
  FiShield,
  FiBell,
  FiLock,
  FiTrash2,
  FiEdit2,
  FiX
} from "react-icons/fi";

export default function VolunteerProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('date');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  // Mock data
  const profile = {
    name: "Eva Johnson",
    email: "eva.johnson@email.com",
    location: "New York, NY",
    memberSince: "January 2024",
    bio: "Passionate about environmental conservation and community development. Looking to make a positive impact through meaningful volunteer work.",
    totalDonations: 12500,
    totalHours: 156,
    badgesEarned: 12,
    programsJoined: 8
  };

  const historyData = [
    { date: "2024-02-15", program: "Community Tree Planting", role: "Team Leader", status: "completed" },
    { date: "2024-01-28", program: "Youth Education Bootcamp", role: "Mentor", status: "completed" },
    { date: "2024-03-01", program: "Clean Water Access Project", role: "Volunteer", status: "ongoing" },
    { date: "2024-02-10", program: "School Renovation Drive", role: "Coordinator", status: "withdrawn" }
  ];

  const [skills, setSkills] = useState([
    "Environmental Science",
    "Community Outreach", 
    "Event Planning",
    "Teaching",
    "First Aid"
  ]);

  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    pushNotifications: false,
    profileVisibility: true,
    dataSharing: false
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'ongoing': return 'text-blue-600 bg-blue-100';
      case 'withdrawn': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setIsAddingSkill(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Profile</h1>
        <Link href="/profile/edit" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D9D9D9] rounded-lg text-[#0C59BB] hover:bg-gray-50 transition">
          <FiEdit2 className="text-lg" />
          <span className="font-medium text-black">Edit Profile</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#0E68DC] rounded-2xl p-6 sm:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white/20">
              <Image
                src="/images/default-avatar.jpg"
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-black">{profile.name}</h1>
            <p className="text-black text-sm sm:text-base max-w-2xl">{profile.bio}</p>
          </div>

          {/* Illustration */}
          <div className="relative">
            <Image
              src="/illustrations/profile-illustration.svg"
              alt="Profile Illustration"
              width={200}
              height={150}
              className="w-32 h-24 sm:w-48 sm:h-36 object-contain"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {[
          { label: "Total Donations Made", value: `$${profile.totalDonations.toLocaleString()}`, icon: FiDollarSign },
          { label: "Total Hours Volunteered", value: `${profile.totalHours}h`, icon: FiClock },
          { label: "Badges Earned", value: profile.badgesEarned, icon: FiAward },
          { label: "Programs Joined", value: profile.programsJoined, icon: FiHeart }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-black text-sm sm:text-base mb-3">{stat.label}</div>
            <div className="flex items-center gap-3">
              <stat.icon className="text-2xl text-[#0E68DC]" />
              <div className="text-black font-bold text-2xl sm:text-3xl">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {[
              { id: 'profile', label: 'Profile Information' },
              { id: 'history', label: 'My History' },
              { id: 'skills', label: 'Skills and Interests' },
              { id: 'settings', label: 'Account Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#0E68DC] border-b-2 border-[#0E68DC]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiUser className="text-gray-400" />
                    <span className="text-black">{profile.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiEdit2 className="text-gray-400" />
                    <span className="text-black">{profile.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiUser className="text-gray-400" />
                    <span className="text-black">{profile.location}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiClock className="text-gray-400" />
                    <span className="text-black">January 2024</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* My History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search programs..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent appearance-none"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
              </div>

              {/* History Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{item.date}</td>
                        <td className="py-3 px-4 text-sm font-medium">{item.program}</td>
                        <td className="py-3 px-4 text-sm">{item.role}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Skills and Interests Tab */}
          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
                  >
                    <span className="text-black">{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ))}
                
                {isAddingSkill ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="Enter skill"
                      className="px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={addSkill}
                      className="p-2 bg-[#0E68DC] text-white rounded-full hover:bg-[#0E68DC]/90"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSkill(false);
                        setNewSkill('');
                      }}
                      className="p-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-full text-gray-600 hover:border-[#0E68DC] hover:text-[#0E68DC]"
                  >
                    <FiPlus className="text-sm" />
                    <span className="text-black">Add More</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Security Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiShield className="text-[#0E68DC]" />
                  Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, twoFactorAuth: !prev.twoFactorAuth}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.twoFactorAuth ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBell className="text-[#0E68DC]" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via email</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, emailNotifications: !prev.emailNotifications}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.emailNotifications ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-600">Receive push notifications</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, pushNotifications: !prev.pushNotifications}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.pushNotifications ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiLock className="text-[#0E68DC]" />
                  Privacy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Profile Visibility</div>
                      <div className="text-sm text-gray-600">Make your profile visible to others</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, profileVisibility: !prev.profileVisibility}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.profileVisibility ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.profileVisibility ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Data Sharing</div>
                      <div className="text-sm text-gray-600">Share data with partners</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, dataSharing: !prev.dataSharing}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.dataSharing ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="pt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                  <FiTrash2 className="text-lg" />
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
