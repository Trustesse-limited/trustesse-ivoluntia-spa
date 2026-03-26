"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye, FiMoreVertical, FiTarget } from "react-icons/fi";

export default function AdminPrograms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const programs = [
    { id: 1, title: "Community Tree Planting", organization: "Green Earth Foundation", status: "active", donations: 12500, target: 20000, volunteers: 45, startDate: "2024-01-15", endDate: "2024-06-15" },
    { id: 2, title: "Youth Education Program", organization: "Education First NGO", status: "active", donations: 8500, target: 15000, volunteers: 32, startDate: "2024-02-01", endDate: "2024-07-01" },
    { id: 3, title: "Healthcare Awareness Camp", organization: "Healthcare Plus", status: "pending", donations: 3200, target: 10000, volunteers: 18, startDate: "2024-03-01", endDate: "2024-08-01" },
    { id: 4, title: "Food Drive Initiative", organization: "Community Helpers", status: "completed", donations: 18000, target: 15000, volunteers: 67, startDate: "2023-12-01", endDate: "2024-01-31" },
    { id: 5, title: "Digital Skills Workshop", organization: "Youth Development Center", status: "active", donations: 6700, target: 12000, volunteers: 28, startDate: "2024-02-15", endDate: "2024-05-15" },
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     program.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || program.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (donations: number, target: number) => {
    return Math.min((donations / target) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-600 mt-2">Manage all platform programs</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Program
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
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
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="overflow-x-auto overflow-y-auto max-h-96 max-sm:max-w-[90vw]">
          <table className="w-full min-w-[600px] sm:min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Program</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Organization</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Volunteers</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Progress</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.map((program, index) => (
                <motion.tr
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate w-full">{program.title}</div>
                      <div className="text-xs text-gray-500 truncate w-full">{program.organization}</div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(program.status)}`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{program.volunteers}</td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <div className="w-full min-w-0">
                      <div className="relative h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${getProgressPercentage(program.volunteers, program.target)}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-900 ml-2">{program.volunteers}/{program.target}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{program.startDate}</td>
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
    </motion.div>
  );
}
