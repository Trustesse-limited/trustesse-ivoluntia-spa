"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiStar, FiFilter, FiSearch,FiChevronUp, FiEye, FiTrash2, FiChevronDown } from "react-icons/fi";

export default function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All Reviews" },
    { value: "5star", label: "5 Stars" },
    { value: "4star", label: "4 Stars" },
    { value: "3star", label: "3 Stars" },
    { value: "2star", label: "2 Stars" },
    { value: "1star", label: "1 Star" },
  ];

  const reviews = [
    { id: 1, user: "Sarah Johnson", organization: "Green Earth Foundation", program: "Community Tree Planting", rating: 5, comment: "Amazing experience! Well organized and meaningful work.", date: "2024-03-15", status: "approved" },
    { id: 2, user: "Michael Chen", organization: "Education First NGO", program: "Youth Education Program", rating: 4, comment: "Great program, learned a lot. Would recommend to others.", date: "2024-03-14", status: "approved" },
    { id: 3, user: "Emma Williams", organization: "Healthcare Plus", program: "Healthcare Awareness Camp", rating: 5, comment: "Life-changing experience. The team was very supportive.", date: "2024-03-13", status: "pending" },
    { id: 4, user: "James Rodriguez", organization: "Community Helpers", program: "Food Drive Initiative", rating: 3, comment: "Good initiative but could be better organized.", date: "2024-03-12", status: "approved" },
    { id: 5, user: "Lisa Anderson", organization: "Youth Development Center", program: "Digital Skills Workshop", rating: 5, comment: "Excellent training! Very practical and useful.", date: "2024-03-11", status: "approved" },
    { id: 6, user: "David Brown", organization: "Rise & Shine Foundation", program: "Women Thrive Initiative", rating: 4, comment: "Important cause, well executed program.", date: "2024-03-10", status: "pending" },
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || review.rating === parseInt(selectedFilter.charAt(0));
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
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

  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="p-2 sm:p-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#161616] truncate w-full">Reviews Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage user reviews and ratings</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex-shrink-0">
          Export Reviews
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
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <FiStar className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">{averageRating}</div>
          <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FiFilter className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">{reviews.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Reviews</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
              <FiEye className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">
            {reviews.filter(r => r.status === "approved").length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Approved</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full min-w-0"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <FiFilter className="text-white text-xs sm:text-sm lg:text-base" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#161616] mb-1 truncate w-full">
            {reviews.filter(r => r.status === "pending").length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Pending</div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="flex-1 relative min-w-0">
          <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <FilterDropdown
          value={selectedFilter}
          onChange={setSelectedFilter}
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          options={filterOptions}
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="overflow-x-auto overflow-y-auto max-h-96 max-sm:max-w-[90vw]">
          <table className="w-full min-w-[600px] sm:min-w-[700px]">
            <thead className="bg-[#0E68DC] border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">User</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">Organization</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">Program</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">Rating</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">Date</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">Status</th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-sm font-semibold text-[#FFFFFF] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review, index) => (
                <motion.tr
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-[#161616] truncate w-full">{review.user}</div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-[#161616]">{review.organization}</span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-[#161616]">{review.program}</span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap min-w-[80px] sm:min-w-[100px]">
                    <span className="text-xs sm:text-sm text-[#161616]">{review.date}</span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
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
