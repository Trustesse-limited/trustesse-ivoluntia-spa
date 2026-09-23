"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiHeart, FiX, FiClock, FiTrendingUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (program: string, interest: string, location: string) => void;
};

const popularPrograms = [
  { title: "Environmental Conservation", category: "Environment", trend: "hot" },
  { title: "Youth Education", category: "Education", trend: "rising" },
  { title: "Healthcare Support", category: "Healthcare", trend: "stable" },
  { title: "Animal Welfare", category: "Animals", trend: "hot" },
  { title: "Community Development", category: "Community", trend: "rising" }
];

const interests = [
  "Education", "Healthcare", "Environment", "Animals",
  "Arts & Culture", "Technology", "Sports", "Elderly Care"
];

const locations = [
  "New York", "Los Angeles", "Chicago", "Houston",
  "Phoenix", "Philadelphia", "San Antonio", "San Diego"
];

const recentSearches = [
  "Environmental programs in New York",
  "Education volunteer opportunities",
  "Healthcare support in Los Angeles"
];

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<'programs' | 'interests' | 'locations'>('programs');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearch = () => {
    onSearch(searchQuery, selectedInterest, selectedLocation);
    onClose();
  };

  const handleSuggestionClick = (suggestion: string, type: 'program' | 'interest' | 'location') => {
    if (type === 'program') {
      setSearchQuery(suggestion);
    } else if (type === 'interest') {
      setSelectedInterest(suggestion);
    } else {
      setSelectedLocation(suggestion);
    }
  };

  const filteredPrograms = popularPrograms.filter(program =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInterests = interests.filter(interest =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20"
      >
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-white/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl mx-4 sm:mx-6 lg:mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Search Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for programs, interests, or locations..."
                  className="w-full pl-12 pr-12 py-3 text-sm md:text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-8 py-3 bg-[#0E68DC] text-white rounded-xl font-medium hover:opacity-90 transition"
              >
                Search
              </motion.button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {selectedInterest && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <FiHeart className="text-xs" />
                  {selectedInterest}
                  <button
                    onClick={() => setSelectedInterest("")}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              )}
              {selectedLocation && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <FiMapPin className="text-xs" />
                  {selectedLocation}
                  <button
                    onClick={() => setSelectedLocation("")}
                    className="ml-1 text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { key: 'programs', label: 'Popular Programs', icon: FiTrendingUp },
              { key: 'interests', label: 'Interests', icon: FiHeart },
              { key: 'locations', label: 'Locations', icon: FiMapPin }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'programs' | 'interests' | 'locations')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#0E68DC] border-b-2 border-[#0E68DC] bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="text-lg" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Recent Searches */}
            {searchQuery === '' && activeTab === 'programs' && recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <FiClock />
                  Recent Searches
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSearchQuery(search)}
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FiSearch className="text-gray-400" />
                        <span>{search}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="grid gap-3">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(program.title, 'program')}
                    className="p-4 border border-gray-200 rounded-xl hover:border-[#0E68DC] hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{program.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{program.category}</p>
                        <div className="flex items-center gap-2">
                          {program.trend === 'hot' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">🔥 Hot</span>
                          )}
                          {program.trend === 'rising' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">📈 Rising</span>
                          )}
                        </div>
                      </div>
                      <FiSearch className="text-gray-400 mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Interests Tab */}
            {activeTab === 'interests' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredInterests.map((interest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSuggestionClick(interest, 'interest')}
                    className="p-4 border border-gray-200 rounded-xl hover:border-[#0E68DC] hover:shadow-md cursor-pointer transition-all text-center"
                  >
                    <FiHeart className="text-2xl text-[#0E68DC] mx-auto mb-2" />
                    <span className="text-sm font-medium">{interest}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Locations Tab */}
            {activeTab === 'locations' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredLocations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSuggestionClick(location, 'location')}
                    className="p-4 border border-gray-200 rounded-xl hover:border-[#0E68DC] hover:shadow-md cursor-pointer transition-all text-center"
                  >
                    <FiMapPin className="text-2xl text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium">{location}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
