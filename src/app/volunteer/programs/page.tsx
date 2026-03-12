"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ProgramCard from "../components/ProgramCard";
import SearchBar from "../components/SearchBar";
import { programs } from "@/lib/mockData";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";

export default function ProgramsPage() {
  const [searchFilters, setSearchFilters] = useState({
    program: "",
    interest: "",
    location: ""
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPrograms = programs
    .filter(program => {
      const matchesSearch = searchFilters.program === "" || 
        program.title.toLowerCase().includes(searchFilters.program.toLowerCase()) ||
        program.organization?.toLowerCase().includes(searchFilters.program.toLowerCase());
      const matchesInterest = searchFilters.interest === "" || 
        program.category.toLowerCase().includes(searchFilters.interest.toLowerCase());
      const matchesLocation = searchFilters.location === "" || 
        program.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      return matchesSearch && matchesInterest && matchesLocation;
    });

  const handleSearch = (program: string, interest: string, location: string) => {
    setSearchFilters({ program, interest, location });
  };

  const programStats = {
    total: programs.length,
    active: programs.filter(p => p.status === 'active').length,
    completed: programs.filter(p => p.status === 'completed').length,
    upcoming: programs.filter(p => p.status === 'upcoming').length
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Programs
          </h1>
          <p className="text-gray-600 mt-1">Discover volunteer opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            {viewMode === 'grid' ? <FiList className="text-gray-600" /> : <FiGrid className="text-gray-600" />}
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Programs', value: programStats.total, color: 'bg-blue-500' },
          { label: 'Active', value: programStats.active, color: 'bg-green-500' },
          { label: 'Completed', value: programStats.completed, color: 'bg-gray-500' },
          { label: 'Upcoming', value: programStats.upcoming, color: 'bg-orange-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <FiFilter className="text-white text-xl" />
              </div>
              <span className="text-3xl font-bold text-black">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-black">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {/* Programs Display */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No programs found matching your criteria.</div>
          <button
            onClick={() => {
              setSearchFilters({ program: "", interest: "", location: "" });
            }}
            className="mt-4 px-4 py-2 bg-[#0E68DC] text-white rounded-md hover:opacity-90 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProgramCard program={program} index={index} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0E68DC] to-[#42A5F5] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {program.organization?.[0] || 'P'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">{program.title}</h3>
                          <p className="text-blue-600 text-sm">{program.organization}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          program.status === 'active' ? 'bg-green-100 text-green-700' :
                          program.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                          program.status === 'upcoming' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {program.status}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {program.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {program.location}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {program.volunteers} volunteers
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">{program.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}
