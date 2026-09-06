"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiMapPin, FiUsers, FiClock, FiCalendar, FiSearch, FiGrid, FiList, FiFilter, FiExternalLink, FiTrendingUp } from "react-icons/fi";
import ProgramCard from "@/components/volunteer/ProgramCard";
import { ProgramItem } from "@/types";
import { programs } from "@/lib/mockData";

const mockFavouritePrograms = programs.slice(0, 6).map(program => ({
  ...program,
  isFavourited: true,
  duration: "3 months",
  targetVolunteers: program.volunteers || 50,
  organization: program.title.includes("Community") ? "Green Earth Foundation" : 
                program.title.includes("Youth") ? "Education First NGO" :
                program.title.includes("Health") ? "Healthcare Plus" : "Community Helpers"
}));

const sortOptions = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'deadline', label: 'Deadline Soon' },
  { value: 'location', label: 'Location' }
];

const categoryFilters = [
  { value: 'all', label: 'All Categories' },
  { value: 'environment', label: 'Environment' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'community', label: 'Community' }
];

export default function VolunteerFavouritesPage() {
  const [favouritePrograms, setFavouritePrograms] = useState(mockFavouritePrograms);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = favouritePrograms
    .filter(program => {
      const matchesSearch = searchQuery === '' || 
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || 
        program.category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'deadline':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  const handleToggleFavourite = (programId: string) => {
    setFavouritePrograms(prev => 
      prev.map(program => 
        program.id === programId 
          ? { ...program, isFavourited: !program.isFavourited }
          : program
      )
    );
  };

  const handleRemoveFromFavourites = (programId: string) => {
    setFavouritePrograms(prev => 
      prev.filter(program => program.id !== programId)
    );
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
          <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
            <FiHeart className="text-red-500" />
            My Favourites
          </h1>
          <p className="text-gray-600 mt-1">Your saved volunteer opportunities</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Favourites', value: favouritePrograms.length, icon: FiHeart, color: 'bg-red-500' },
          { label: 'Active Programs', value: favouritePrograms.filter(p => p.status === 'active').length, icon: FiUsers, color: 'bg-green-500' },
          { label: 'Upcoming', value: favouritePrograms.filter(p => p.status === 'upcoming').length, icon: FiCalendar, color: 'bg-blue-500' },
          { label: 'New This Week', value: 3, icon: FiTrendingUp, color: 'bg-purple-500' }
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
                <stat.icon className="text-white text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favourites..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent bg-white"
          >
            {categoryFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent bg-white"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFilter className="text-gray-400" />
            {filteredPrograms.length} of {favouritePrograms.length}
          </div>
        </div>

        {/* Programs */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No favourite programs found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or add some programs to favourites</p>
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
                    className="relative group"
                  >
                    <ProgramCard program={program} index={index} />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromFavourites(program.id)}
                        className="p-2 bg-red-500 text-white rounded-full shadow-lg"
                        title="Remove from favourites"
                      >
                        <FiHeart className="text-sm" />
                      </motion.button>
                    </div>
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
                        {program.organization[0]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg truncate">{program.title}</h3>
                            <p className="text-blue-600 text-sm">{program.organization}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleFavourite(program.id)}
                              className="p-2"
                            >
                              <FiHeart className={`text-lg ${program.isFavourited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            >
                              <FiExternalLink className="text-lg" />
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiMapPin className="text-xs" />
                            {program.location}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiClock className="text-xs" />
                            {program.duration}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiUsers className="text-xs" />
                            {program.targetVolunteers} volunteers
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
      </div>
    </motion.section>
  );
}
