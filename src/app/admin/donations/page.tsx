"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiDollarSign, FiCalendar, FiTrendingUp, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AdminDonations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const donations = [
    { id: 1, donor: "John Doe", email: "john@email.com", amount: 500, program: "Community Tree Planting", organization: "Green Earth Foundation", date: "2024-03-15", status: "completed" },
    { id: 2, donor: "Sarah Smith", email: "sarah@email.com", amount: 250, program: "Youth Education Program", organization: "Education First NGO", date: "2024-03-14", status: "completed" },
    { id: 3, donor: "Mike Johnson", email: "mike@email.com", amount: 1000, program: "Healthcare Awareness Camp", organization: "Healthcare Plus", date: "2024-03-13", status: "pending" },
    { id: 4, donor: "Emily Davis", email: "emily@email.com", amount: 150, program: "Food Drive Initiative", organization: "Community Helpers", date: "2024-03-12", status: "completed" },
    { id: 5, donor: "Robert Wilson", email: "robert@email.com", amount: 750, program: "Digital Skills Workshop", organization: "Youth Development Center", date: "2024-03-11", status: "failed" },
  ];

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     donation.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || donation.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalStats = {
    total: donations.reduce((sum, d) => sum + d.amount, 0),
    completed: donations.filter(d => d.status === "completed").reduce((sum, d) => sum + d.amount, 0),
    pending: donations.filter(d => d.status === "pending").reduce((sum, d) => sum + d.amount, 0),
    failed: donations.filter(d => d.status === "failed").reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <div className="p-2 sm:p-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate w-full">Donations Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Track and manage all platform donations</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex-shrink-0">
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FiDollarSign className="text-white text-sm sm:text-base" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate w-full">₦{totalStats.total.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Donations</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
              <FiTrendingUp className="text-white text-sm sm:text-base" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate w-full">₦{totalStats.completed.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-gray-600">Completed</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <FiCalendar className="text-white text-sm sm:text-base" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate w-full">₦{totalStats.pending.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-gray-600">Pending</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center">
              <FiFilter className="text-white text-sm sm:text-base" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate w-full">₦{totalStats.failed.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-gray-600">Failed</div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="flex-1 relative min-w-0">
          <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            type="text"
            placeholder="Search donations..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="overflow-x-auto overflow-y-auto max-h-96 max-w-[96vw]">
          <table className="w-full min-w-[600px] sm:min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Donor</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation, index) => (
                <motion.tr
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate w-full">{donation.donor}</div>
                      <div className="text-xs text-gray-500 truncate w-full">{donation.email}</div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">₦{donation.amount}</span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{donation.date}</td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </td>
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
