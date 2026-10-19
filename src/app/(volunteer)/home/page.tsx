"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import ProgramCard from "@/components/volunteer/ProgramCard";
import ProgramCardSkeleton from "@/components/volunteer/ProgramCardSkeleton";
import SearchBar from "@/components/volunteer/SearchBar";
import { AppButton } from "@/components/AppButton";
import { useAuthStore } from "@/store";
import { useOnboardingStore } from "@/store";
import { getProgramsAction } from "@/app/actions/auth";
import { ProgramItem } from "@/types";
import { ProgramApiResponse } from "@/types/api";
import { formatProgramLocation, normalizeProgramStatus } from "@/lib/utils";

export default function VolunteerHomePage() {
  const { user } = useAuthStore();
  const { volunteerData } = useOnboardingStore();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        // Pass search and status parameters to the API
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (status) params.status = status;

        const response = await getProgramsAction(
          Object.keys(params).length > 0 ? params : undefined
        );

        if (response.success && response.data) {
          // Map API response to ProgramItem interface
          const mappedPrograms = (response.data as ProgramApiResponse[]).map((program: ProgramApiResponse): ProgramItem => ({
            id: program.id || '',
            title: program.title || program.name || '',
            startDate: program.startDate || '',
            endDate: program.endDate || '',
            location: formatProgramLocation(program.location || program.city),
            donationTarget: program.donationTarget || program.targetAmount || 0,
            raised: program.raised || program.raisedAmount || 0,
            category: program.category || program.foundationCategory || '',
            goals: program.goals || '',
            description: program.description || program.mission || '',
            image: program.image || program.logo || '',
            volunteers: program.volunteers || 0,
            status: normalizeProgramStatus(program.status),
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
  }, [search, status]);

  const handleSearch = (searchValue: string, statusValue: string) => {
    setSearch(searchValue);
    setStatus(statusValue);
  };

  const displayName = user?.firstName || volunteerData?.formData?.bioData?.firstName || user?.email?.split('@')[0] || 'Volunteer';

  const hasActiveFilters = search || status;

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
      <SearchBar
        onSearch={handleSearch}
        initialSearch={searchParams.get("search") ?? ""}
        initialStatus={searchParams.get("status") ?? ""}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <ProgramCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && programs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            {hasActiveFilters
              ? "No programs found matching your criteria."
              : "No programs available at the moment."}
          </div>
          {hasActiveFilters && (
            <AppButton
              text="Clear Filters"
              onClick={() => handleSearch("", "")}
              className="!mt-4 !px-4 !py-2 !rounded-md"
            />
          )}
        </div>
      )}

      {/* Program Cards Grid */}
      {!isLoading && programs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </motion.section>
  );
}
