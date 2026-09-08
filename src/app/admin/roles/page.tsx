"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiMoreVertical, FiShield, FiUsers } from "react-icons/fi";

export default function RolesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const roles = [
    { id: 1, name: "Super Admin", description: "Full system access with all permissions", userCount: 3, status: "active", created: "2024-01-15", lastModified: "2024-03-20" },
    { id: 2, name: "Organization Admin", description: "Manage organization programs and volunteers", userCount: 45, status: "active", created: "2024-01-20", lastModified: "2024-03-18" },
    { id: 3, name: "Volunteer", description: "Participate in programs and manage profile", userCount: 1234, status: "active", created: "2024-01-25", lastModified: "2024-03-15" },
    { id: 4, name: "Program Manager", description: "Manage specific programs within organization", userCount: 28, status: "active", created: "2024-02-01", lastModified: "2024-03-22" },
    { id: 5, name: "Guest User", description: "Limited access for viewing public content", userCount: 156, status: "inactive", created: "2024-02-10", lastModified: "2024-03-10" },
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || role.status === selectedFilter;
    const matchesTab = activeTab === "all" || role.status === activeTab;
    return matchesSearch && matchesFilter && matchesTab;
  });

  const stats = [
    { title: "Total Roles", value: roles.length },
    { title: "Active Roles", value: roles.filter(role => role.status === "active").length },
    { title: "Inactive Roles", value: roles.filter(role => role.status === "inactive").length },
    { title: "Total Users", value: roles.reduce((sum, role) => sum + role.userCount, 0) },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRoleColor = (name: string) => {
    switch (name) {
      case "Super Admin": return "bg-purple-100 text-purple-800";
      case "Organization Admin": return "bg-blue-100 text-blue-800";
      case "Volunteer": return "bg-green-100 text-green-800";
      case "Program Manager": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { key: "all", label: "All Roles" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "system", label: "System Roles" },
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
            Roles Management
          </h1>
          <p className="text-sm text-black break-words">
            Manage user roles and permissions
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
              placeholder="Search roles..."
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
        {filteredRoles.length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            No roles found
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="overflow-x-auto overflow-y-auto max-h-96 max-sm:max-w-[90vw]">
              <table className="w-full min-w-[700px] sm:min-w-[800px] lg:min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Role</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Description</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">Users</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">Status</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">Created</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Last Modified</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoles.map((role, index) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                        <button 
                          onClick={() => router.push(`/admin/roles/${role.id}`)}
                          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 truncate w-full text-left hover:underline transition-colors"
                        >
                          {role.name}
                        </button>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-600 truncate block max-w-[180px] sm:max-w-[200px]">{role.description}</span>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FiUsers className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">{role.userCount}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role.status)}`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-600">{role.created}</span>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-600">{role.lastModified}</span>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 flex-shrink-0">
                            <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 flex-shrink-0">
                            <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 flex-shrink-0">
                            <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
