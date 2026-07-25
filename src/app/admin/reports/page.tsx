"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiDollarSign, FiTrendingUp, FiBarChart2, FiPieChart } from "react-icons/fi";

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const reportData = {
    overview: {
      totalRevenue: 245000,
      totalUsers: 15420,
      totalOrganizations: 1234,
      totalPrograms: 5678,
      growth: 23.5
    },
    donations: {
      monthly: [45000, 52000, 48000, 61000, 55000, 67000],
      categories: {
        "Education": 35,
        "Healthcare": 25,
        "Environment": 20,
        "Community": 15,
        "Other": 5
      }
    },
    users: {
      newUsers: [120, 145, 132, 189, 167, 201],
      activeUsers: [1200, 1350, 1420, 1580, 1650, 1720],
      retention: 78.5
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {["overview", "donations", "users"].map((report) => (
          <button
            key={report}
            onClick={() => setSelectedReport(report)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              selectedReport === report
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {report.charAt(0).toUpperCase() + report.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {selectedReport === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiDollarSign className="text-white text-xl" />
                </div>
                <div className="text-green-500 text-sm font-medium">+{reportData.overview.growth}%</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">${reportData.overview.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="text-white text-xl" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{reportData.overview.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Users</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <FiBarChart2 className="text-white text-xl" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{reportData.overview.totalOrganizations.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Organizations</div>
            </motion.div>
f 
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <FiPieChart className="text-white text-xl" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{reportData.overview.totalPrograms.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Programs</div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Donations Report */}
      {selectedReport === "donations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trend</h3>
              <div className="space-y-3">
                {reportData.donations.monthly.map((amount, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Month {index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Categories</h3>
              <div className="space-y-3">
                {Object.entries(reportData.donations.categories).map(([category, percentage]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Report */}
      {selectedReport === "users" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
              <div className="space-y-3">
                {reportData.users.newUsers.map((users, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Month {index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{users} new users</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Users & Retention */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Active Users</span>
                  <span className="text-lg font-bold text-gray-900">
                    {reportData.users.activeUsers[reportData.users.activeUsers.length - 1].toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Retention Rate</span>
                  <span className="text-lg font-bold text-green-600">{reportData.users.retention}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
