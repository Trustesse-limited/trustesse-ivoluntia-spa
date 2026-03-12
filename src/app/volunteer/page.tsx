"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ProgramCard from "./components/ProgramCard";
import SearchBar from "./components/SearchBar";
import { programs } from "@/lib/mockData";

export default function VolunteerHomePage() {
  const [searchFilters, setSearchFilters] = useState({
    program: "",
    interest: "",
    location: ""
  });

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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Hello, Eva
        </h1>
        
      </div>

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program, index) => (
          <ProgramCard key={index} program={program} index={index} />
        ))}
      </div>

      {filteredPrograms.length === 0 && (
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
      )}
    </motion.section>
  );
}
