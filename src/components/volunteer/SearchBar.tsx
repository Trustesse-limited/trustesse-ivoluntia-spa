"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiHome,
  FiX,
  FiChevronDown,
  FiFilter,
  FiChevronUp,
} from "react-icons/fi";
import { ProgramItem } from "@/types";
import { useAuthStore } from "@/store";

/**
 * Filters applied to the volunteer program list via the top search bar.
 * Mirrors the Figma design: "Find a program", "Date", "Location",
 * "Interest", "Foundation" fields plus a "Search" button.
 */
export type ProgramFilters = {
  search: string;
  date: string; // YYYY-MM-DD — programs running on this day
  location: string;
  interest: string;
  foundation: string;
};

export const EMPTY_PROGRAM_FILTERS: ProgramFilters = {
  search: "",
  date: "",
  location: "",
  interest: "",
  foundation: "",
};

type SearchBarProps = {
  /** Applied filters (controlled by the parent so it can reset them). */
  filters: ProgramFilters;
  /** Called when the user clicks Search / presses Enter / changes a chip. */
  onApply: (filters: ProgramFilters) => void;
  /** Full program list — used to derive the Location/Interest options. */
  programs: ProgramItem[];
  /**
   * Optional Foundation options (e.g. accumulated across paginated fetches).
   * Falls back to deriving them from `programs`.
   */
  foundationOptions?: string[];
};

const SEARCH_INPUT_CLASSES =
  "w-full pl-11 pr-10 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E68DC]/50 focus:border-transparent transition-all cursor-text";

const FIELD_CLASSES =
  "w-full py-2.5 pl-10 pr-8 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent transition-all cursor-pointer";

export default function SearchBar({
  filters,
  onApply,
  programs,
  foundationOptions,
}: SearchBarProps) {
  const { user } = useAuthStore();

  // Draft state is edited in the fields; it is applied to the list when the
  // user clicks Search (or presses Enter). Synced from the applied filters so
  // an external reset (e.g. "Clear Filters" in the empty state) clears the
  // fields too.
  const [draft, setDraft] = useState<ProgramFilters>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  // Derive filter options from the loaded programs so the dropdowns always
  // match the data actually available from the API.
  const { locationOptions, interestOptions, derivedFoundationOptions } =
    useMemo(() => {
      const uniqueSorted = (values: string[]) =>
        Array.from(
          new Set(values.map((value) => value.trim()).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));

      // Combine program categories with volunteer's interests
      const programInterests = programs.map((program) => program.category);
      const volunteerInterests = user?.interests || [];
      const allInterests = [...programInterests, ...volunteerInterests];

      return {
        locationOptions: uniqueSorted(programs.map((program) => program.location)),
        interestOptions: uniqueSorted(allInterests),
        derivedFoundationOptions: uniqueSorted(
          programs.map((program) => program.organization)
        ),
      };
    }, [programs, user?.interests]);

  const foundationOptionList = foundationOptions ?? derivedFoundationOptions;

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const applyDraft = (next: ProgramFilters) => {
    setDraft(next);
    onApply(next);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    applyDraft(draft);
  };

  const handleSearchChange = (value: string) => {
    setDraft({ ...draft, search: value });
  };

  const removeFilterChip = (key: keyof ProgramFilters) => {
    applyDraft({ ...filters, [key]: "" });
  };

  const chipConfig: { key: keyof ProgramFilters; label: string }[] = [
    { key: "search", label: filters.search },
    { key: "date", label: filters.date },
    { key: "location", label: filters.location },
    { key: "interest", label: filters.interest },
    { key: "foundation", label: filters.foundation },
  ];

  // Filter panel state - expandable accordion
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = [
    draft.date,
    draft.location,
    draft.interest,
    draft.foundation,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof ProgramFilters, value: string) => {
    const newDraft = { ...draft, [key]: value };
    setDraft(newDraft);
    // Apply filters immediately on change
    onApply(newDraft);
  };

  const handleClearFilters = () => {
    // Clear only the filter fields; keep the search text
    const newDraft = {
      ...EMPTY_PROGRAM_FILTERS,
      search: draft.search,
    };
    setDraft(newDraft);
    onApply(newDraft);
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Field renderers for the expandable filter section
  const renderDateField = () => (
    <div className="relative">
      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
      {!draft.date && (
        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none z-10">
          Date
        </span>
      )}
      <input
        type="date"
        value={draft.date}
        onChange={(e) => handleFilterChange("date", e.target.value)}
        aria-label="Date"
        className={`${FIELD_CLASSES} ${
          draft.date ? "" : "[&::-webkit-datetime-edit]:text-transparent"
        }`}
      />
    </div>
  );

  const renderLocationField = () => (
    <div className="relative">
      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
      <select
        value={draft.location}
        onChange={(e) => handleFilterChange("location", e.target.value)}
        aria-label="Location"
        className={`${FIELD_CLASSES} appearance-none`}
      >
        <option value="">Location</option>
        {locationOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  const renderInterestField = () => (
    <div className="relative">
      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
      <select
        value={draft.interest}
        onChange={(e) => handleFilterChange("interest", e.target.value)}
        aria-label="Interest"
        className={`${FIELD_CLASSES} appearance-none`}
      >
        <option value="">Interest</option>
        {interestOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  const renderFoundationField = () => (
    <div className="relative">
      <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
      <select
        value={draft.foundation}
        onChange={(e) => handleFilterChange("foundation", e.target.value)}
        aria-label="Foundation"
        className={`${FIELD_CLASSES} appearance-none`}
      >
        <option value="">Foundation</option>
        {foundationOptionList.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="w-full">
      {/* Search bar with Search button and Filters button */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Main search row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 sm:p-5">
          {/* Search field - full width on mobile, auto on desktop */}
          <div className="relative flex-1 min-w-0 w-full">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={draft.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter")
                  handleSubmit(event as React.FormEvent);
              }}
              placeholder="Search programs…"
              aria-label="Search programs"
              className={SEARCH_INPUT_CLASSES}
            />
            {draft.search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search text"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Buttons row - on mobile: same row below search, on desktop: same row as search */}
          <div className="flex gap-3 w-full sm:w-auto">
            {/* Search button */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e as React.FormEvent)}
              className="flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium shadow-md hover:bg-[#0a55b0] transition-all hover:shadow-lg cursor-pointer"
            >
              <FiSearch className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Filters button - toggles expandable section */}
            <button
              type="button"
              onClick={toggleFilters}
              className="relative flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
              {isFilterOpen ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center px-1 rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable filter section */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-end mb-4">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Date</label>
                    {renderDateField()}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Location</label>
                    {renderLocationField()}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Interest</label>
                    {renderInterestField()}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Foundation</label>
                    {renderFoundationField()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Applied filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
          {chipConfig.map(({ key, label }) =>
            filters[key] ? (
              <span
                key={key}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => removeFilterChip(key)}
                  className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                  aria-label={`Remove ${key} filter`}
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ) : null
          )}
          <button
            type="button"
            onClick={() => applyDraft({ ...EMPTY_PROGRAM_FILTERS })}
            className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <FiX className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}
    </div>
  );
}
