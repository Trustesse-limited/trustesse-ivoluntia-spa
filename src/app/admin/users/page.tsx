"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const users = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Admin", status: "active", joined: "Jan 15, 2024", lastActive: "2 hours ago" },
    { id: 2, name: "Michael Chen", email: "michael.c@example.com", role: "Volunteer", status: "active", joined: "Feb 20, 2024", lastActive: "1 day ago" },
    { id: 3, name: "Emily Rodriguez", email: "emily.r@example.com", role: "Organization Manager", status: "inactive", joined: "Mar 10, 2024", lastActive: "3 days ago" },
    { id: 4, name: "David Kim", email: "david.k@example.com", role: "Volunteer", status: "active", joined: "Apr 5, 2024", lastActive: "5 minutes ago" },
    { id: 5, name: "Lisa Anderson", email: "lisa.a@example.com", role: "Admin", status: "active", joined: "Feb 15, 2024", lastActive: "2 hours ago" },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || user.status === selectedFilter;
    const matchesTab = activeTab === "all" || user.status === activeTab;
    return matchesSearch && matchesFilter && matchesTab;
  });

  const stats = [
    { title: "Total Users", value: users.length },
    { title: "Active Users", value: users.filter(user => user.status === "active").length },
    { title: "Inactive Users", value: users.filter(user => user.status === "inactive").length },
    { title: "Admins", value: users.filter(user => user.role === "Admin").length },
  ];

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
    { key: "all", label: "All Users" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "admin", label: "Admins" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            Users Management
          </h1>
          <p className="text-sm text-black break-words">
            Manage all platform users
          </p>
        </div>
        
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Tab Content */}
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-96 max-sm:max-w-[90vw]">
            <table className="w-full min-w-[600px] sm:min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">User</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Role</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Joined</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Active</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
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
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <button 
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 truncate w-full text-left hover:underline transition-colors"
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-600 truncate block">{user.email}</span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-600">{user.joined}</span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-600">{user.lastActive}</span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
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
