"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch,FiChevronUp, FiMessageSquare, FiBook, FiVideo, FiDownload, FiExternalLink, FiChevronDown } from "react-icons/fi";

export default function AdminHelp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "getting-started", label: "Getting Started" },
    { value: "user-management", label: "User Management" },
    { value: "organizations", label: "Organizations" },
    { value: "programs", label: "Programs" },
    { value: "donations", label: "Donations" },
    { value: "technical", label: "Technical Support" },
  ];

  const helpArticles = [
    { 
      id: 1, 
      title: "Getting Started with Admin Dashboard", 
      category: "getting-started", 
      description: "Learn how to navigate and use the admin dashboard effectively.",
      type: "article",
      date: "2024-03-15",
      readTime: "5 min"
    },
    { 
      id: 2, 
      title: "Managing User Accounts", 
      category: "user-management", 
      description: "Complete guide on creating, editing, and managing user accounts.",
      type: "video",
      date: "2024-03-14",
      readTime: "8 min"
    },
    { 
      id: 3, 
      title: "Organization Approval Process", 
      category: "organizations", 
      description: "How to review and approve organization applications.",
      type: "article",
      date: "2024-03-13",
      readTime: "6 min"
    },
    { 
      id: 4, 
      title: "Program Management Basics", 
      category: "programs", 
      description: "Understanding how to create and manage volunteer programs.",
      type: "article",
      date: "2024-03-12",
      readTime: "10 min"
    },
    { 
      id: 5, 
      title: "Donation Tracking and Reporting", 
      category: "donations", 
      description: "Track donations and generate comprehensive reports.",
      type: "video",
      date: "2024-03-11",
      readTime: "12 min"
    },
    { 
      id: 6, 
      title: "Troubleshooting Common Issues", 
      category: "technical", 
      description: "Solutions for common technical issues administrators face.",
      type: "article",
      date: "2024-03-10",
      readTime: "7 min"
    },
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <FiVideo className="w-4 h-4" />;
      case "article": return <FiBook className="w-4 h-4" />;
      default: return <FiBook className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-100 text-red-800";
      case "article": return "bg-blue-100 text-blue-800";
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#161616] truncate w-full">Help & Support</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Find guides, tutorials, and support resources</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex-shrink-0 flex items-center gap-2">
          <FiMessageSquare className="w-4 h-4" />
          Contact Support
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FiBook className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">24</div>
          <div className="text-xs sm:text-sm text-gray-600">Help Articles</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-red-500 rounded-full flex items-center justify-center">
              <FiVideo className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">12</div>
          <div className="text-xs sm:text-sm text-gray-600">Video Tutorials</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
              <FiDownload className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">8</div>
          <div className="text-xs sm:text-sm text-gray-600">Downloads</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <FiMessageSquare className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">24/7</div>
          <div className="text-xs sm:text-sm text-gray-600">Support Available</div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="flex-1 relative min-w-0">
          <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <FilterDropdown
          value={selectedCategory}
          onChange={setSelectedCategory}
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          options={categoryOptions}
        />
      </div>

      {/* Help Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(article.type)}`}>
                    {getTypeIcon(article.type)}
                    <span className="ml-1 hidden sm:inline">{article.type}</span>
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#161616] mb-2 truncate w-full">{article.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{article.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{article.date}</span>
              <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex items-center gap-1">
                <span className="hidden sm:inline">Read More</span>
                <FiExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-4 sm:p-6 lg:p-8 w-full"
      >
        <div className="text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#161616] mb-3 sm:mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Our support team is here to help you with any questions or issues.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#0E68DC] text-white rounded-lg hover:bg-[#0D5BC7] transition text-sm sm:text-base font-medium flex items-center justify-center gap-2">
              <FiMessageSquare className="w-4 h-4" />
              Live Chat
            </button>
            <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#0E68DC] border border-[#0E68DC] rounded-lg hover:bg-blue-50 transition text-sm sm:text-base font-medium">
              Email Support
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
