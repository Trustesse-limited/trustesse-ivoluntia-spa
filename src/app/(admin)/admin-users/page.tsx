"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiFilter, FiEye, FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

export default function UsersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  const users = [
    {
      id: 1,
      profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      userName: "Cooper, Kristin",
      email: "grossman@gmail.com",
      gender: "Male",
      location: "Coppell, Virginia",
      role: "Volunteers",
      status: "Active",
      joinedDate: "12/3/2025",
      task: "Task : Task Name"
    },
    {
      id: 2,
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      userName: "Cooper, Kristin",
      email: "grossman@gmail.com",
      gender: "Male",
      location: "Coppell, Virginia",
      role: "Auditor",
      status: "Active",
      joinedDate: "12/3/2025",
      task: "Task : Task Name"
    },
    {
      id: 3,
      profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      userName: "Cooper, Kristin",
      email: "grossman@gmail.com",
      gender: "Male",
      location: "Coppell, Virginia",
      role: "Auditor",
      status: "Active",
      joinedDate: "12/3/2025",
      task: "Task : Task Name"
    },
    {
      id: 4,
      profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      userName: "Cooper, Kristin",
      email: "grossman@gmail.com",
      gender: "Male",
      location: "Coppell, Virginia",
      role: "Auditor",
      status: "Active",
      joinedDate: "12/3/2025",
      task: "Task : Task Name"
    },
    {
      id: 5,
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
      userName: "Cooper, Kristin",
      email: "grossman@gmail.com",
      gender: "Male",
      location: "Coppell, Virginia",
      role: "Auditor",
      status: "Blocked",
      joinedDate: "12/3/2025",
      task: "Task : Task Name"
    },
    {
      id: 6,
      profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
      userName: "Cooper, Kristin",
      email: "grossman@gmail.com",
      gender: "Male",
      location: "Coppell, Virginia",
      role: "Auditor",
      status: "Blocked",
      joinedDate: "12/3/2025",
      task: "Task : Task Name"
    }
  ];

  const filteredUsers = users.filter(user => {
    return activeTab === "users" ? user.status === "Active" : user.status === "Blocked";
  });

  const stats = [
    { title: "Total Users", value: users.length },
    { title: "Active Users", value: users.filter(user => user.status === "Active").length },
    { title: "Blocked Users", value: users.filter(user => user.status === "Blocked").length },
    { title: "Super Admin", value: users.filter(user => user.role === "Super Admin").length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#E6F0FB] text-[#0E68DC]";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin": return "bg-purple-100 text-purple-800";
      case "Organization Admin": return "bg-blue-100 text-blue-800";
      case "Volunteers": return "bg-green-100 text-green-800";
      case "Auditor": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { key: "users", label: "Users" },
    { key: "blocked", label: "Blocked Users" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0 bg-white py-3 px-4 border-t-2 border-t-[#A9A7A7]">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            Users Management
          </h1>
          <p className="text-sm text-black break-words">
            Manage all platform users
          </p>
        </div>
       
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 flex flex-col justify-between w-full"
          >
            <h2 className="text-sm font-medium text-black">{stat.title}</h2>
            <p className="text-4xl font-bold text-gray-900 mt-4">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg m-4 shadow p-4 sm:p-6">
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
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-96 max-md:w-[calc(90vw-2rem)] w-[calc(90vw-13rem)]">
            <table className="w-full min-w-[600px] sm:min-w-[700px]">
              <thead className="bg-[#E6F0FB] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">User Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">Email Address</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">Gender</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-[#052C57] tracking-wider whitespace-nowrap">
                    <select className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#FFFFFF]">
                      <option value="all">Filter</option>
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.profilePicture} 
                          alt={user.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{user.gender}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{user.location}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold text-gray-600 rounded-full`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-6 py-3 text-xs font-semibold rounded-sm ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button 
                        onClick={() => router.push(`/admin-users/${user.id}`)}
                        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        View details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
