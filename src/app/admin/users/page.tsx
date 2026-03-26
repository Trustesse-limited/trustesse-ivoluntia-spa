"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Admin",
    status: "active",
    joined: "Jan 15, 2024",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    role: "Volunteer",
    status: "active",
    joined: "Feb 20, 2024",
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    role: "Organization Manager",
    status: "inactive",
    joined: "Mar 10, 2024",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.k@example.com",
    role: "Volunteer",
    status: "active",
    joined: "Apr 5, 2024",
    lastActive: "5 minutes ago",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredUsers = users.filter((userItem) => {
    const matchesSearch = userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || userItem.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Organization Manager":
        return "bg-blue-100 text-blue-800";
      case "Volunteer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-2 sm:p-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate w-full">Users Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all platform users</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex-shrink-0">
          Add User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="flex-1 relative min-w-0">
          <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base flex-shrink-0"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="overflow-x-auto overflow-y-auto max-h-96 max-w-[96vw]">
          <table className="w-full min-w-[600px] sm:min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">User</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Role</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Joined</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Active</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((userItem) => (
                <motion.tr
                  key={userItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: userItem.id * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate w-full">{userItem.name}</div>
                      <div className="text-xs text-gray-500 truncate w-full">{userItem.email}</div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(userItem.status)}`}>
                      {userItem.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{userItem.joined}</td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{userItem.lastActive}</td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
      </div>
    </div>
  );
}
