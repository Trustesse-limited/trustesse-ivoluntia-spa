"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProgramCard from "@/components/volunteer/ProgramCard";
import SearchBar from "@/components/volunteer/SearchBar";
import { AppButton } from "@/components/AppButton";
import { useAuthStore } from "@/store";
import { api } from "@/lib/api";
import { ProgramItem } from "@/types";
import { ProgramApiResponse } from "@/types/api";

export default function VolunteerHomePage() {
  const { user } = useAuthStore();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    program: "",
    interest: "",
    location: ""
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await api.programs.getAll();
        
        if (response.success && response.data) {
          // Map API response to ProgramItem interface
          const mappedPrograms = (response.data as ProgramApiResponse[]).map((program: ProgramApiResponse): ProgramItem => ({
            id: program.id || '',
            title: program.title || program.name || '',
            startDate: program.startDate || '',
            endDate: program.endDate || '',
            location: program.location || program.city || '',
            donationTarget: program.donationTarget || program.targetAmount || 0,
            raised: program.raised || program.raisedAmount || 0,
            category: program.category || program.foundationCategory || '',
            goals: program.goals || '',
            description: program.description || program.mission || '',
            image: program.image || program.logo || '',
            volunteers: program.volunteers || 0,
            status: program.status || 'Active',
            organization: program.organization || program.organizationName || '',
            isFavourited: false,
            duration: program.duration || '',
            targetVolunteers: program.targetVolunteers || 0,
          }));
          setPrograms(mappedPrograms);
        } else {
          // If API fails, treat as empty state (endpoint might not exist yet)
          setPrograms([]);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        // Treat errors as empty state instead of showing error
        setPrograms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'Volunteer';

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
          Hello, {displayName}
        </h1>
        
      </div>

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Loading programs...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            {searchFilters.program || searchFilters.interest || searchFilters.location
              ? "No programs found matching your criteria."
              : "No programs available at the moment."}
          </div>
          {(searchFilters.program || searchFilters.interest || searchFilters.location) && (
            <AppButton
              text="Clear Filters"
              onClick={() => {
                setSearchFilters({ program: "", interest: "", location: "" });
              }}
              className="!mt-4 !px-4 !py-2 !rounded-md"
            />
          )}
        </div>
      )}

      {/* Program Cards Grid */}
      {!isLoading && filteredPrograms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </motion.section>
  );
}
