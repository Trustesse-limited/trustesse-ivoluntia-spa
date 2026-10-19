"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AppButton } from "@/components/AppButton";

type SearchBarProps = {
  onSearch: (search: string, status: string) => void;
  initialSearch?: string;
  initialStatus?: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "All Status", icon: FiClock },
  { value: "active", label: "Active", icon: FiMapPin },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "forfeited", label: "Forfeited" },
];

const POPULAR_INTERESTS = [
  "Education",
  "Healthcare",
  "Environment",
  "Animals",
  "Arts & Culture",
  "Technology",
  "Sports",
  "Elderly Care",
];

export default function SearchBar({
  onSearch,
  initialSearch = "",
  initialStatus = "",
}: SearchBarProps) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const hasActiveFilters = Boolean(search || status || selectedInterest);

  const debouncedSearch = useCallback(
    (searchValue: string, statusValue: string) => {
      const timer = setTimeout(() => {
        onSearch(searchValue, statusValue);
      }, 300);
      return () => clearTimeout(timer);
    },
    [onSearch]
  );

  useEffect(() => {
    const timer = debouncedSearch(search, status);
    return timer;
  }, [search, status, debouncedSearch]);

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setSelectedInterest("");
    onSearch("", "");
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setIsSheetOpen(false);
  };

  const handleInterestChange = (value: string) => {
    setSelectedInterest(selectedInterest === value ? "" : value);
  };

  const removeFilterChip = (type: "search" | "status" | "interest") => {
    if (type === "search") setSearch("");
    if (type === "status") setStatus("");
    if (type === "interest") setSelectedInterest("");
    onSearch(search, status);
  };

  return (
    <div className="w-full">
      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-3 px-2">
          {search && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium">
              <span>{search}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilterChip("search");
                }}
                className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                aria-label="Remove search filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {status && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium">
              <span>
                {STATUS_OPTIONS.find((o) => o.value === status)?.label || status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilterChip("status");
                }}
                className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                aria-label="Remove status filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedInterest && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium">
              <span>{selectedInterest}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilterChip("interest");
                }}
                className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                aria-label="Remove interest filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            <FiX className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}
      <div className="p-4 sm:p-5">
        {/* Search Input */}
        <div className="relative mb-4 sm:mb-0">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs by name, organization, or category..."
            className="w-full pl-11 pr-10 py-3.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent transition-all text-base sm:text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <div className="flex justify-end sm:justify-start mt-2 sm:mt-0">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  onClick={() => setIsSheetOpen(true)}
                  className="flex items-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-2.5 bg-[#0E68DC] text-white rounded-xl text-sm sm:text-base font-medium shadow-md hover:bg-[#0a55b0] transition-all hover:shadow-lg"
                >
                  <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="flex -mx-1 mt-0.5 sm:mt-0 min-w-[20px] h-[20px] sm:h-auto items-center justify-center px-1 sm:px-1.5 rounded-full bg-red-500 text-xs sm:text-[10px] font-bold text-white ring-2 ring-white">
                      {[
                        Boolean(search),
                        Boolean(status),
                        Boolean(selectedInterest),
                      ].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetClose asChild>
                <button className="absolute right-4 top-4 z-20 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </SheetClose>
              <SheetContent className="sm:rounded-[24px] p-0 sm:p-6 shadow-2xl" side="bottom">
                <SheetHeader className="pb-4 sm:pb-6">
                  <SheetTitle className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    Filters
                  </SheetTitle>
                  <SheetDescription className="text-gray-500 text-sm">
                    Narrow down your program search
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 sm:space-y-8">
                  {/* Status Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 sm:mb-4">
                      Status
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {STATUS_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = status === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className={`flex flex-col items-center gap-2 px-3 py-3 sm:px-4 sm:py-4 rounded-xl border transition-all ${
                              isSelected
                                ? "border-[#0E68DC] bg-[#0E68DC]/10 text-[#0E68DC] shadow-sm"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />}
                            <span className="text-xs sm:text-sm font-medium leading-tight">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interest Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 sm:mb-4">
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {POPULAR_INTERESTS.map((interest) => {
                        const isSelected = selectedInterest === interest;
                        return (
                          <button
                            key={interest}
                            onClick={() => handleInterestChange(interest)}
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border transition-all text-sm sm:text-base font-medium ${
                              isSelected
                                ? "border-[#0E68DC] bg-[#0E68DC]/10 text-[#0E68DC] shadow-sm"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <SheetFooter className="pt-6 sm:pt-8 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleClearFilters}
                      className="flex-1 py-3 sm:py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors"
                    >
                      Clear all
                    </button>
                    <AppButton
                      text="Apply Filters"
                      onClick={() => setIsSheetOpen(false)}
                      variant="custom"
                      className="w-full sm:w-auto bg-[#0E68DC] hover:bg-[#0a55b0] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium"
                    />
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
    </div>
  );
}
