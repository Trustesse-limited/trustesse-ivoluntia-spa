"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";

type SearchBarProps = {
  onSearch: (program: string, interest: string, location: string) => void;
};

const popularPrograms = [
  "Environmental Conservation",
  "Youth Education", 
  "Healthcare Support",
  "Animal Welfare",
  "Community Development"
];

const interests = [
  "Education",
  "Healthcare", 
  "Environment",
  "Animals",
  "Arts & Culture",
  "Technology",
  "Sports",
  "Elderly Care"
];

const locations = [
  "New York",
  "Los Angeles",
  "Chicago", 
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego"
];

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [program, setProgram] = useState("");
  const [interest, setInterest] = useState("");
  const [location, setLocation] = useState("");
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showProgramSuggestions, setShowProgramSuggestions] = useState(false);
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [expandedInput, setExpandedInput] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const programRef = useRef<HTMLDivElement>(null);
  const interestRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (programRef.current && !programRef.current.contains(e.target as Node)) {
        setShowProgramSuggestions(false);
        if (expandedInput === 'program') setExpandedInput(null);
      }
      if (interestRef.current && !interestRef.current.contains(e.target as Node)) {
        setShowInterestSuggestions(false);
        if (expandedInput === 'interest') setExpandedInput(null);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
        if (expandedInput === 'location') setExpandedInput(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedInput]);

  const getProgramSuggestions = () => {
    if (!program) return popularPrograms;
    return popularPrograms.filter(p => 
      p.toLowerCase().includes(program.toLowerCase())
    );
  };

  const getInterestSuggestions = () => {
    if (!interest) return interests;
    return interests.filter(i => 
      i.toLowerCase().includes(interest.toLowerCase())
    );
  };

  const getLocationSuggestions = () => {
    if (!location) return locations;
    return locations.filter(l => 
      l.toLowerCase().includes(location.toLowerCase())
    );
  };

  const handleSearch = () => {
    onSearch(program, interest, location);
  };

  const handleModalSearch = (program: string, interest: string, location: string) => {
    onSearch(program, interest, location);
    setIsModalOpen(false);
  };

  const handleInputFocus = (type: string) => {
    setIsModalOpen(true);
  };

  // Desktop view - inputs visible, modal on click
  if (!isMobile && !isTablet) {
    return (
      <div className="bg-[#173A561A] rounded-lg p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Find a Program</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Program Search Input */}
          <div ref={programRef} className="relative">
            <motion.div
              initial={{ width: "auto", opacity: 1 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  onFocus={() => handleInputFocus('program')}
                  onClick={() => handleInputFocus('program')}
                  placeholder="Any Programme"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0E68DC] focus:border-[#0E68DC] cursor-pointer"
                />
              </div>
              {showProgramSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {getProgramSuggestions().map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setProgram(suggestion);
                        setShowProgramSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {suggestion}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Interest Search Input */}
          <div ref={interestRef} className="relative">
            <motion.div
              initial={{ width: "auto", opacity: 1 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative">
                <FiHeart className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  onFocus={() => handleInputFocus('interest')}
                  onClick={() => handleInputFocus('interest')}
                  placeholder="Any Interest"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0E68DC] focus:border-[#0E68DC] cursor-pointer"
                />
              </div>
              {showInterestSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {getInterestSuggestions().map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setInterest(suggestion);
                        setShowInterestSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {suggestion}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Location Search Input */}
          <div ref={locationRef} className="relative">
            <motion.div
              initial={{ width: "auto", opacity: 1 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => handleInputFocus('location')}
                  onClick={() => handleInputFocus('location')}
                  placeholder="Any Location"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0E68DC] focus:border-[#0E68DC] cursor-pointer"
                />
              </div>
              {showLocationSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {getLocationSuggestions().map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setLocation(suggestion);
                        setShowLocationSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {suggestion}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
          <motion.button>
            Search
          </motion.button>
        </div>
      </div>
    );
  }

  // Mobile/Tablet view - modal trigger
  return (
    <>
      <div className="bg-[#173A561A] rounded-lg p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Find a Program</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsModalOpen(true)}
              onClick={() => setIsModalOpen(true)}
              placeholder="Search for programs, interests, or locations..."
              className="w-full pl-12 pr-20 py-3 text-sm md:text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-[#0E68DC] text-white rounded-xl hover:opacity-90 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={handleModalSearch}
      />
    </>
  );
}
