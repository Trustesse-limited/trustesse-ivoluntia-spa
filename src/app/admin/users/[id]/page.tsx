"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit } from "react-icons/fi";

// Mock user data - matching to users table data
const mockUsers = [
  {
    id: "1",
    userName: "Albert Flores",
    email: "debra.holt@example.com",
    phone: "080123456789",
    certificationNumber: "2",
    gender: "Male",
    location: "Coppell, Virginia",
    role: "Top-Volunteer",
    status: "Active",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Lorem ipsum dolor sit amet consectetur. Posuere velit enim cras id viverra ornare pellentesque porttitor euismod. Fames amet faucibus euismod lacus massa arcu sed diam. Lectus odio platea in in dictum netus laoreet pellentesque sollicitudin. Leo vitae amet amet eu dolor. Aliquam mattis fermentum dictum vestibulum.",
    skills: ["Research", "Devops", "Audio-visual setup", "Content Publishing", "Computer literacy"],
    interests: ["Collaboration", "Growth", "Agriculture", "Technical support", "Computer literacy"]
  },
  {
    id: "2",
    userName: "Cooper, Kristin",
    email: "grossman@gmail.com",
    phone: "080123456789",
    certificationNumber: "2",
    gender: "Male",
    location: "Coppell, Virginia",
    role: "Volunteers",
    status: "Active",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Lorem ipsum dolor sit amet consectetur. Posuere velit enim cras id viverra ornare pellentesque porttitor euismod. Fames amet faucibus euismod lacus massa arcu sed diam. Lectus odio platea in in dictum netus laoreet pellentesque sollicitudin. Leo vitae amet amet eu dolor. Aliquam mattis fermentum dictum vestibulum.",
    skills: ["Research", "Devops", "Audio-visual setup", "Content Publishing", "Computer literacy"],
    interests: ["Collaboration", "Growth", "Agriculture", "Technical support", "Computer literacy"]
  },
  {
    id: "3",
    userName: "Cooper, Kristin",
    email: "grossman@gmail.com",
    phone: "080123456789",
    certificationNumber: "2",
    gender: "Male",
    location: "Coppell, Virginia",
    role: "Auditor",
    status: "Active",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Lorem ipsum dolor sit amet consectetur. Posuere velit enim cras id viverra ornare pellentesque porttitor euismod. Fames amet faucibus euismod lacus massa arcu sed diam. Lectus odio platea in in dictum netus laoreet pellentesque sollicitudin. Leo vitae amet amet eu dolor. Aliquam mattis fermentum dictum vestibulum.",
    skills: ["Research", "Devops", "Audio-visual setup", "Content Publishing", "Computer literacy"],
    interests: ["Collaboration", "Growth", "Agriculture", "Technical support", "Computer literacy"]
  },
  {
    id: "4",
    userName: "Cooper, Kristin",
    email: "grossman@gmail.com",
    phone: "080123456789",
    certificationNumber: "2",
    gender: "Male",
    location: "Coppell, Virginia",
    role: "Auditor",
    status: "Active",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Lorem ipsum dolor sit amet consectetur. Posuere velit enim cras id viverra ornare pellentesque porttitor euismod. Fames amet faucibus euismod lacus massa arcu sed diam. Lectus odio platea in in dictum netus laoreet pellentesque sollicitudin. Leo vitae amet amet eu dolor. Aliquam mattis fermentum dictum vestibulum.",
    skills: ["Research", "Devops", "Audio-visual setup", "Content Publishing", "Computer literacy"],
    interests: ["Collaboration", "Growth", "Agriculture", "Technical support", "Computer literacy"]
  },
  {
    id: "5",
    userName: "Cooper, Kristin",
    email: "grossman@gmail.com",
    phone: "080123456789",
    certificationNumber: "2",
    gender: "Male",
    location: "Coppell, Virginia",
    role: "Auditor",
    status: "Blocked",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Lorem ipsum dolor sit amet consectetur. Posuere velit enim cras id viverra ornare pellentesque porttitor euismod. Fames amet faucibus euismod lacus massa arcu sed diam. Lectus odio platea in in dictum netus laoreet pellentesque sollicitudin. Leo vitae amet amet eu dolor. Aliquam mattis fermentum dictum vestibulum.",
    skills: ["Research", "Devops", "Audio-visual setup", "Content Publishing", "Computer literacy"],
    interests: ["Collaboration", "Growth", "Agriculture", "Technical support", "Computer literacy"]
  },
  {
    id: "6",
    userName: "Cooper, Kristin",
    email: "grossman@gmail.com",
    phone: "080123456789",
    certificationNumber: "2",
    gender: "Male",
    location: "Coppell, Virginia",
    role: "Auditor",
    status: "Blocked",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Lorem ipsum dolor sit amet consectetur. Posuere velit enim cras id viverra ornare pellentesque porttitor euismod. Fames amet faucibus euismod lacus massa arcu sed diam. Lectus odio platea in in dictum netus laoreet pellentesque sollicitudin. Leo vitae amet amet eu dolor. Aliquam mattis fermentum dictum vestibulum.",
    skills: ["Research", "Devops", "Audio-visual setup", "Content Publishing", "Computer literacy"],
    interests: ["Collaboration", "Growth", "Agriculture", "Technical support", "Computer literacy"]
  }
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

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
      case "Active": return "bg-[#E6F0FB] text-[#0E68DC]";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

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
            User Management
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

      {/* White Background Container */}
      <div className="bg-white gap-4 flex flex-col rounded-4xl p-6">
        {/* User Profile Card */}
        <div className="bg-white border rounded-xl border-[#0000001F] p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <img 
                src={user.profilePicture} 
                alt={user.userName}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{user.userName}</h2>
                <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                  {user.role}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certification Number</p>
                  <p className="text-sm font-medium text-gray-900">{user.certificationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{user.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-sm font-medium text-gray-900">{user.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-900">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg border rounded-xl border-[#0000001F] p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
          <p className="text-gray-600 leading-relaxed">{user.bio}</p>
        </div>

        {/* Skills Section */}
        <div className="bg-white border rounded-xl border-[#0000001F] p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <div key={index} className="px-3 py-2 border border-[#E6E0E9] rounded text-sm text-gray-700">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white border rounded-xl border-[#0000001F]  p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <div key={index} className="px-3 py-2 border border-[#E6E0E9] rounded text-sm text-gray-700">
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
