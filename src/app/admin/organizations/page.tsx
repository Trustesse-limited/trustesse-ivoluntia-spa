"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const organizations = [
    { id: 1, name: "Rise & Shine Foundation", status: "active", email: "info@riseshine.org", phone: "+234-800-000-0001", registered: "2024-01-15" },
    { id: 2, name: "Education First NGO", status: "pending", email: "contact@edufirst.ng", phone: "+234-800-000-0002", registered: "2024-01-20" },
    { id: 3, name: "Healthcare Plus", status: "active", email: "hello@healthcareplus.org", phone: "+234-800-000-0003", registered: "2024-02-01" },
    { id: 4, name: "Community Helpers", status: "blocked", email: "admin@communityhelpers.ng", phone: "+234-800-000-0004", registered: "2024-02-10" },
    { id: 5, name: "Youth Development Center", status: "active", email: "info@youthdev.org", phone: "+234-800-000-0005", registered: "2024-02-15" },
  ];

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || org.status === selectedFilter;
    const matchesTab = activeTab === "all" || org.status === activeTab;
    return matchesSearch && matchesFilter && matchesTab;
  });

  const stats = [
    { title: "Total Organizations", value: organizations.length },
    { title: "Active Organizations", value: organizations.filter(org => org.status === "active").length },
    { title: "Pending Organizations", value: organizations.filter(org => org.status === "pending").length },
    { title: "Blocked Organizations", value: organizations.filter(org => org.status === "blocked").length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { key: "all", label: "All Organizations" },
    { key: "active", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "blocked", label: "Blocked" },
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
            Organizations Management
          </h1>
          <p className="text-sm text-black break-words">
            Manage foundations seamlessly
          </p>
        </div>
       
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="bg-white rounded-lg shadow mx-4 mb-6 p-4 sm:p-6">
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
              placeholder="Search organizations..."
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
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Tab Content */}
        {filteredOrganizations.length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            No organizations found
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-96 max-md:w-[80vw] w-[calc(90vw-13rem)]">
            <table className="w-full min-w-[600px] sm:min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Organization</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Registered</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map((org, index) => (
                  <motion.tr
                    key={org.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate w-full">{org.name}</div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-600 truncate block">{org.email}</span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-600">{org.phone}</span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(org.status)}`}>
                        {org.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-600">{org.registered}</span>
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
