"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiUsers, FiCalendar, FiChevronUp, FiMessageSquare, FiFilter, FiChevronDown } from "react-icons/fi";

export default function AdminBroadcast() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const filterOptions = [
    { value: "all", label: "All Users" },
    { value: "volunteers", label: "Volunteers Only" },
    { value: "organizations", label: "Organizations Only" },
    { value: "admins", label: "Admins Only" },
  ];

  const recentBroadcasts = [
    { id: 1, subject: "System Maintenance Notice", recipients: "All Users", date: "2024-03-15", status: "sent" },
    { id: 2, subject: "New Feature Launch", recipients: "Volunteers", date: "2024-03-14", status: "sent" },
    { id: 3, subject: "Policy Update", recipients: "Organizations", date: "2024-03-13", status: "draft" },
    { id: 4, subject: "Welcome Message", recipients: "New Users", date: "2024-03-12", status: "sent" },
    { id: 5, subject: "Security Alert", recipients: "All Users", date: "2024-03-11", status: "sent" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <div className="p-2 sm:p-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#161616] truncate w-full">Broadcast Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Send messages to users and organizations</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex-shrink-0">
          New Broadcast
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {/* New Broadcast Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 order-2 lg:order-1"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#073B78] mb-3 sm:mb-4 lg:mb-6">Create New Broadcast</h2>
            
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Target Audience */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Target Audience</label>
                <FilterDropdown
                  value={selectedFilter}
                  onChange={setSelectedFilter}
                  isOpen={dropdownOpen}
                  setIsOpen={setDropdownOpen}
                  options={filterOptions}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter broadcast subject"
                  className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                <button className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-[#0E68DC] text-white rounded-lg hover:bg-[#0D5BC7] transition text-xs sm:text-sm lg:text-base font-medium flex items-center justify-center gap-2">
                  <FiSend className="w-3 h-3 sm:w-4 sm:h-4" />
                  Send Broadcast
                </button>
                <button className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-xs sm:text-sm lg:text-base font-medium">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Broadcasts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 sm:space-y-4 lg:space-y-6 order-1 lg:order-2"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#073B78] mb-3 sm:mb-4 lg:mb-6">Recent Broadcasts</h2>
            
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
              {recentBroadcasts.map((broadcast) => (
                <motion.div
                  key={broadcast.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: broadcast.id * 0.05 }}
                  className="border border-gray-200 rounded-lg p-2 sm:p-3 lg:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1 sm:mb-2">
                    <h3 className="text-xs sm:text-sm lg:text-base font-medium text-[#161616] truncate flex-1">{broadcast.subject}</h3>
                    <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(broadcast.status)} flex-shrink-0 ml-2`}>
                      {broadcast.status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{broadcast.recipients}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{broadcast.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#073B78] mb-3 sm:mb-4 lg:mb-6">Quick Stats</h2>
            
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Total Sent</span>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-[#161616]">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Drafts</span>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-[#161616]">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Scheduled</span>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-[#161616]">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Open Rate</span>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-green-600">78%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
