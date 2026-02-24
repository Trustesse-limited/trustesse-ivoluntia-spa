"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiX, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    firstName: "Eva",
    lastName: "Johnson",
    email: "eva.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Passionate about environmental conservation and community development. Looking to make a positive impact through meaningful volunteer work.",
    joinedDate: "January 2024",
    skills: ["Environmental Science", "Community Outreach", "Event Planning", "Teaching", "First Aid"]
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving profile data:", profileData);
    router.push('/volunteer/profile');
  };

  const handleCancel = () => {
    router.push('/volunteer/profile');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Profile</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D9D9D9] rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            <FiX className="text-lg" />
            <span className="font-medium">Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#0E68DC] text-white rounded-lg hover:bg-[#0E68DC]/90 transition"
          >
            <FiSave className="text-lg" />
            <span className="font-medium">Save Changes</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                placeholder="Enter your location"
              />
            </div>
          </div>

          {/* Member Since (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profileData.joinedDate}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Member since"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <div className="relative">
            <FiFileText className="absolute left-3 top-3 text-gray-400" />
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
              >
                <span className="text-sm">{skill}</span>
                <button
                  onClick={() => {
                    setProfileData(prev => ({
                      ...prev,
                      skills: prev.skills.filter((_, i) => i !== index)
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newSkill = prompt("Enter new skill:");
                if (newSkill && newSkill.trim()) {
                  setProfileData(prev => ({
                    ...prev,
                    skills: [...prev.skills, newSkill.trim()]
                  }));
                }
              }}
              className="flex items-center gap-1 px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-gray-600 hover:border-[#0E68DC] hover:text-[#0E68DC]"
            >
              <span className="text-sm">+ Add Skill</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
