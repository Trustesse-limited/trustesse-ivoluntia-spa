"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiMapPin,
  FiUsers,
  FiClock,
  FiCalendar,
  FiSearch,
  FiGrid,
  FiList,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import ProgramCard from "@/components/volunteer/ProgramCard";
import ProgramCardSkeleton from "@/components/volunteer/ProgramCardSkeleton";
import { ProgramItem } from "@/types";
import { ProgramApiResponse } from "@/types/api";
import {
  getFavoriteProgramsAction,
  addFavoriteProgramAction,
  removeFavoriteProgramAction,
} from "@/app/actions/auth";
import { formatProgramLocation, normalizeProgramStatus } from "@/lib/utils";

const sortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "name", label: "Name (A-Z)" },
  { value: "deadline", label: "Deadline Soon" },
  { value: "location", label: "Location" },
];

export default function VolunteerFavouritesPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the current user's favourites from the volunteer favorites endpoint
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await getFavoriteProgramsAction();

        if (response.success && response.data) {
          // Map API response to ProgramItem interface
          const mappedPrograms = (response.data as ProgramApiResponse[]).map(
            (program: ProgramApiResponse): ProgramItem => ({
              id: program.id || "",
              title: program.title || program.name || "",
              startDate: program.startDate || "",
              endDate: program.endDate || "",
              location: formatProgramLocation(program.location || program.city),
              donationTarget: program.donationTarget || program.targetAmount || 0,
              raised: program.raised || program.raisedAmount || 0,
              category: program.category || program.foundationCategory || "",
              goals: program.goals || "",
              description: program.description || program.mission || "",
              image: program.image || program.logo || "",
              volunteers: program.volunteers || 0,
              status: normalizeProgramStatus(program.status),
              organization: program.organization || program.organizationName || "",
              isFavourited: true,
              duration: program.duration || "",
              targetVolunteers: program.targetVolunteers || 0,
            })
          );
          setPrograms(mappedPrograms);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        console.error("Error fetching favourites:", err);
        setPrograms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Category options come from the loaded favourites so they always match
  // the real data
  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        programs
          .map((program) => program.category)
          .filter((category): category is string => Boolean(category))
      )
    ).sort((a, b) => a.localeCompare(b));
    return [
      { value: "all", label: "All Categories" },
      ...unique.map((category) => ({
        value: category.toLowerCase(),
        label: category,
      })),
    ];
  }, [programs]);

  // Search / category / sort refine the currently loaded page client-side
  // (the favorites API paginates server-side and exposes no query params)
  const filteredPrograms = useMemo(
    () =>
      programs
        .filter((program) => {
          const matchesSearch =
            searchQuery === "" ||
            program.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            program.organization
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          const matchesCategory =
            categoryFilter === "all" ||
            program.category.toLowerCase() === categoryFilter;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "name":
              return a.title.localeCompare(b.title);
            case "deadline":
              return (
                new Date(a.endDate || a.startDate).getTime() -
                new Date(b.endDate || b.startDate).getTime()
              );
            case "location":
              return a.location.localeCompare(b.location);
            default:
              return 0;
          }
        }),
    [programs, searchQuery, categoryFilter, sortBy]
  );

  // Everything on this screen is a favourite, so toggling a heart off
  // removes it — optimistic with rollback on failure
  const handleRemoveFavourite = async (programId: string) => {
    const previousPrograms = programs;

    setPrograms((prev) => prev.filter((program) => program.id !== programId));

    const response = await removeFavoriteProgramAction(programId);
    if (response.success) {
      toast.success("Removed from favourites");
    } else {
      setPrograms(previousPrograms);
      toast.error(response.error || "Failed to remove from favourites");
    }
  };

  const handleToggleFavorite = async (program: ProgramItem, next: boolean) => {
    const programId = program.id;
    if (!programId) return;

    const response = next
      ? await addFavoriteProgramAction(programId)
      : await removeFavoriteProgramAction(programId);

    if (response.success) {
      setPrograms((prev) =>
        next
          ? [...prev, { ...program, isFavourited: true }]
          : prev.filter((p) => p.id !== programId)
      );
      toast.success(next ? "Added to favourites" : "Removed from favourites");
    } else {
      toast.error(response.error || "Failed to update favourites");
    }
  };

  // "Total Favourites" is the server-side total; the other stats describe
  // the currently loaded page (the API offers no aggregate stats)
  const totalCount = programs.length;
  const stats = [
    {
      label: "Total Favourites",
      value: totalCount,
      icon: FiHeart,
      color: "bg-red-500",
    },
    {
      label: "Active Programs",
      value: programs.filter((program) => program.status === "active").length,
      icon: FiUsers,
      color: "bg-green-500",
    },
    {
      label: "On This Page",
      value: programs.length,
      icon: FiCalendar,
      color: "bg-blue-500",
    },
  ];

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
            My Favourites
          </h1>
          <p className="text-gray-600 mt-1">Your saved volunteer opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            aria-label={
              viewMode === "grid" ? "Switch to list view" : "Switch to grid view"
            }
          >
            {viewMode === "grid" ? (
              <FiList className="text-gray-600" />
            ) : (
              <FiGrid className="text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}
              >
                <stat.icon className="text-white text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stat.value}
              </span>
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
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent bg-white cursor-pointer"
          >
            {categoryOptions.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent bg-white cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFilter className="text-gray-400" />
            {filteredPrograms.length} of {totalCount}
          </div>
        </div>

        {/* Programs */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <ProgramCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {totalCount === 0
                ? "You haven't favourited any programs yet"
                : "No favourite programs found"}
            </p>
            <p className="text-gray-400 text-sm">
              {totalCount === 0
                ? "Browse programs and tap the heart icon to save them here"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProgramCard
                      program={program}
                      isFavourited
                      onToggleFavorite={handleToggleFavorite}
                    />
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
                        {program.organization[0] || program.title[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg truncate">
                              {program.title}
                            </h3>
                            <p className="text-blue-600 text-sm">
                              {program.organization}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveFavourite(program.id)}
                              className="p-2 cursor-pointer"
                              aria-label="Remove from favourites"
                            >
                              <FiHeart className="text-lg fill-red-500 text-red-500" />
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
                            {program.duration || "—"}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiUsers className="text-xs" />
                            {program.targetVolunteers || program.volunteers}{" "}
                            volunteers
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {program.description}
                        </p>
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

