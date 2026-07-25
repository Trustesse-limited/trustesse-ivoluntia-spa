 "use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiDollarSign, FiUsers, FiCalendar, FiTrendingUp } from "react-icons/fi";

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
  "Education First NGO", 
  "Healthcare Plus",
  "Community Helpers",
  "Youth Development Center",
];

const topVolunteers = [
  "Sarah Johnson",
  "Michael Chen",
  "Emma Williams",
  "James Rodriguez",
  "Lisa Anderson",
];

export default function AdminDashboard() {
  const [donationsFilter, setDonationsFilter] = useState("thisWeek");
  const [organizationsFilter, setOrganizationsFilter] = useState("thisWeek");
  const [volunteersFilter, setVolunteersFilter] = useState("thisWeek");
  const [donationsDropdownOpen, setDonationsDropdownOpen] = useState(false);
  const [organizationsDropdownOpen, setOrganizationsDropdownOpen] = useState(false);
  const [volunteersDropdownOpen, setVolunteersDropdownOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const filterOptions = [
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "thisYear", label: "This Year" },
  ];

  const FilterDropdown = ({ 
    value, 
    onChange, 
    isOpen, 
    setIsOpen, 
    options 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    isOpen: boolean; 
    setIsOpen: (open: boolean) => void; 
    options: { value: string; label: string }[] 
  }) => {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 sm:px-4 py-2 bg-[#0E68DC] text-white rounded-full text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-[#0D5BC7] transition-colors cursor-pointer"
        >
          <span>{selectedOption?.label}</span>
          {isOpen ? (
            <FiChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? "bg-blue-50 text-[#0E68DC] font-medium" : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const stats = [
    { title: "Total Donations", value: "₦2,450,000", subtitle: "+12% from last month" },
    { title: "Active Volunteers", value: "1,234", subtitle: "+8% from last month" },
    { title: "Organizations", value: "89", subtitle: "+3 new this month" },
    { title: "Programs", value: "156", subtitle: "+12 this month" },
  ];

  const donationsData = [
    { program: "Community Tree Planting", date: "2024-03-15", amount: "₦50,000" },
    { program: "Youth Education Program", date: "2024-03-14", amount: "₦25,000" },
    { program: "Healthcare Awareness Camp", date: "2024-03-13", amount: "₦75,000" },
    { program: "Food Drive Initiative", date: "2024-03-12", amount: "₦15,000" },
    { program: "Digital Skills Workshop", date: "2024-03-11", amount: "₦35,000" },
  ];

  const topOrganizations = [
    "Green Earth Foundation",
    "Education First NGO", 
    "Healthcare Plus",
    "Community Helpers",
    "Youth Development Center",
  ];

  const topVolunteers = [
    "Sarah Johnson",
    "Michael Chen",
    "Emma Williams",
    "James Rodriguez",
    "Lisa Anderson",
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#161616] mb-2">Welcome Trustesse,</h2>
          <p className="text-gray-600 text-sm sm:text-base">See your progress, insights, and recent actions</p>
        </motion.div>
        
        {/* Current Date Display */}
        <div className="text-xs sm:text-base text-[#161616] font-[700]">
          {currentDate}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
          >
            <div className="text-xs sm:text-sm font-semibold text-[#073B78] mb-1 sm:mb-2 truncate w-full">{stat.title}</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#161616] mb-1 truncate w-full">{stat.value}</div>
            {stat.subtitle && (
              <div className="text-xs sm:text-sm text-gray-500">{stat.subtitle}</div>
            )}
            {/* Filter Button for Total Donations */}
            {stat.title === "Total Donations" && (
              <div className="mt-3 sm:mt-4">
                <FilterDropdown
                  value={donationsFilter}
                  onChange={setDonationsFilter}
                  isOpen={donationsDropdownOpen}
                  setIsOpen={setDonationsDropdownOpen}
                  options={filterOptions}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid px-4  grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
        {/* Recent Donations Table - Takes 2 columns on XL screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 w-full min-w-0 xl:col-span-2"
        >
          <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 border-b border-gray-200">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#073B78] text-center truncate w-full">Recent Donations</h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-96 max-sm:max-w-[90vw]">
            <table className="w-full min-w-[500px] sm:min-w-[600px]">
              <thead className="bg-[#0E68DC] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF]   whitespace-nowrap">Program</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF]   whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF]   whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donationsData.map((donation, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-[#161616] whitespace-nowrap min-w-[120px] sm:min-w-[150px] max-w-[200px] sm:max-w-[250px]">{donation.program}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-[#161616] whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{donation.date}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm font-medium text-[#161616] whitespace-nowrap min-w-[80px] sm:min-w-[100px]">{donation.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column - Top Lists */}
        <div className="space-y-4 sm:space-y-6 w-full">
          {/* Top Performing Organizations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 w-full min-w-0"
          >
            <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#073B78] text-center truncate w-full">Top Performing Organizations</h3>
            </div>
            {/* Filter Button */}
            <div className="px-3 sm:px-4 lg:px-6 py-2 border-b border-gray-100">
              <FilterDropdown
                value={organizationsFilter}
                onChange={setOrganizationsFilter}
                isOpen={organizationsDropdownOpen}
                setIsOpen={setOrganizationsDropdownOpen}
                options={filterOptions}
              />
            </div>
            <div className="p-3 sm:p-4 lg:p-6 max-h-80 overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                {topOrganizations.map((org, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-[#161616] truncate min-w-0 flex-1">{org}</span>
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
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#073B78] text-center truncate w-full">Top Performing Volunteers</h3>
            </div>
            {/* Filter Button */}
            <div className="px-3 sm:px-4 lg:px-6 py-2 border-b border-gray-100">
              <FilterDropdown
                value={volunteersFilter}
                onChange={setVolunteersFilter}
                isOpen={volunteersDropdownOpen}
                setIsOpen={setVolunteersDropdownOpen}
                options={filterOptions}
              />
            </div>
            <div className="p-3 sm:p-4 lg:p-6 max-h-80 overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                {topVolunteers.map((volunteer, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-[#161616] truncate min-w-0 flex-1">{volunteer}</span>
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
