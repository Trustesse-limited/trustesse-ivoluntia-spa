"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Sample data
const donationsData = [
  { program: "Feed the Future", date: "11/04/25", amount: "100,000" },
  { program: "Padher Project", date: "11/04/25", amount: "70,000" },
  { program: "Women Thrive Initiative", date: "10/04/25", amount: "20,000" },
  { program: "Green Lagos Drive", date: "10/04/25", amount: "50,000" },
  { program: "Books & Beyond Campaign", date: "09/04/25", amount: "100,000" },
  { program: "Clean Up Lagos Drive", date: "09/04/25", amount: "500,000" },
];

const topOrganizations = [
  "Rise & Shine Foundation",
  "WaterWell Foundation", 
  "FoodFirst Mission",
  "GreenEarth Foundation",
  "Hands Of Hope",
];

const topVolunteers = [
  "Mary Hopkins",
  "Grace Williams",
  "Folarin Esupofo",
  "Johnson Smith", 
  "Nara Jacobs",
];

export default function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    setCurrentDate(formattedDate);
  }, []);

  const statsCards = [
    { title: "Total Donations", value: "₦50,000,000", subtitle: "This Week" },
    { title: "Total Programs", value: "260", subtitle: "" },
    { title: "Active Foundation", value: "100", subtitle: "" },
    { title: "Total Volunteers", value: "1050", subtitle: "" },
  ];

  return (
    <div className="pb-4 sm:pb-6 lg:pb-8">
      {/* Header Section with Date and Greeting */}
      <div className="flex flex-row items-center justify-between bg-white p-4 mb-4 sm:mb-8">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome Trustesse,</h2>
          <p className="text-gray-600 text-sm sm:text-base">See your progress, insights, and recent actions</p>
        </motion.div>
        
        {/* Current Date Display */}
        <div className="text-xs sm:text-base text-gray-900 font-[700]">
          {currentDate}
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="p-2 sm:p-4 w-full overflow-x-hidden">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
            >
              <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 truncate w-full">{stat.title}</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate w-full">{stat.value}</div>
              {stat.subtitle && (
                <div className="text-xs sm:text-sm text-gray-500">{stat.subtitle}</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Recent Donations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6 w-full min-w-0"
        >
          <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 border-b border-gray-200">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate w-full">Recent Donations</h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-96 max-w-[96vw]">
            <table className="w-full min-w-[500px] sm:min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Program</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donationsData.map((donation, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap min-w-[120px] sm:min-w-[150px] max-w-[200px] sm:max-w-[250px]">{donation.program}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{donation.date}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{donation.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
          {/* Top Performing Organizations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 w-full min-w-0"
          >
            <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate w-full">Top Performing Organizations (This Week)</h3>
            </div>
            <div className="p-3 sm:p-4 lg:p-6 max-h-80 overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                {topOrganizations.map((org, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-900 truncate min-w-0 flex-1">{org}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Performing Volunteers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 w-full min-w-0"
          >
            <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate w-full">Top Performing Volunteers (This Week)</h3>
            </div>
            <div className="p-3 sm:p-4 lg:p-6 max-h-80 overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                {topVolunteers.map((volunteer, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-900 truncate min-w-0 flex-1">{volunteer}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
