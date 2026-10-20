"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProgramCard from "@/components/volunteer/ProgramCard";
import ProgramCardSkeleton from "@/components/volunteer/ProgramCardSkeleton";
import SearchBar, {
  ProgramFilters,
  EMPTY_PROGRAM_FILTERS,
} from "@/components/volunteer/SearchBar";
import Pagination from "@/components/ui/Pagination";
import { AppButton } from "@/components/AppButton";
import { useAuthStore } from "@/store";
import { useOnboardingStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import { getProgramsAction, getFavoriteProgramsAction, addFavoriteProgramAction, removeFavoriteProgramAction } from "@/app/actions/auth";
import toast from "react-hot-toast";
import { ProgramItem } from "@/types";
import { ProgramApiResponse, ProgramsPagination } from "@/types/api";
import {
  formatProgramLocation,
  normalizeProgramStatus,
  parseProgramDate,
  toDateString,
} from "@/lib/utils";

/** Programs per page — 3-column grid × 4 rows */
const PAGE_SIZE = 12;

/**
 * Build the `dateRange` query value for the get-programs API from the single
 * day picked in the UI (programs whose range overlaps that day).
 *
 * ASSUMPTION: the API accepts two ISO datetimes joined by a comma
 * (`<start>,<end>`). If the backend expects a different format, only this
 * helper needs to change.
 */
function toDateRangeParam(date: string): string {
  return `${date}T00:00:00,${date}T23:59:59`;
}

/**
 * Client-side safety net applied to the fetched page. search/dateRange and
 * foundationId are sent to the API (see swagger for get-programs), but the
 * backend has been observed ignoring query params before (see the foundationId
 * note on the org programs page), so every filter is also applied locally.
 * Location/Interest have no API param at all and are client-side only.
 */
function filterPrograms(
  programs: ProgramItem[],
  filters: ProgramFilters
): ProgramItem[] {
  const search = filters.search.trim().toLowerCase();

  return programs.filter((program) => {
    if (search) {
      const haystack =
        `${program.title} ${program.organization} ${program.category}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.date) {
      // Keep programs whose start/end range includes the selected day
      const start = parseProgramDate(program.startDate);
      const end = parseProgramDate(program.endDate);
      if (!start || !end) return false;
      const selected = filters.date; // YYYY-MM-DD
      if (!(toDateString(start) <= selected && selected <= toDateString(end))) {
        return false;
      }
    }

    if (filters.location && program.location !== filters.location) return false;
    if (filters.interest && program.category !== filters.interest) return false;
    if (filters.foundation && program.organization !== filters.foundation) {
      return false;
    }

    return true;
  });
}

export default function VolunteerHomePage() {
  const { user, setVolunteerProfile } = useAuthStore();
  const { volunteerData } = useOnboardingStore();
  const { getVolunteerProfile } = useAuthActions();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProgramFilters>(EMPTY_PROGRAM_FILTERS);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ProgramsPagination | null>(null);
  // foundation id -> name, accumulated across fetches so the Foundation
  // dropdown keeps every option even while a filter narrows the list
  const [foundations, setFoundations] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // Guards the URL-sync effect from wiping query params on the first commit
  // (before the URL-init effect's state has been applied)
  const isFirstRenderRef = useRef(true);

  // Populate filters and page from the URL on first load so a shared link
  // reproduces the exact search. Runs once; later URL changes originate from
  // the sync effect below.
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") ?? "",
      date: searchParams.get("date") ?? "",
      location: searchParams.get("location") ?? "",
      interest: searchParams.get("interest") ?? "",
      foundation: searchParams.get("foundation") ?? "",
    });
    const pageParam = parseInt(searchParams.get("page") ?? "", 10);
    setPage(!Number.isNaN(pageParam) && pageParam > 0 ? pageParam : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch volunteer profile to get interests for the search filter
  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      // Only fetch if user is a volunteer and doesn't have interests stored
      if (user?.accountType === 'Volunteer' && !user?.interests) {
        try {
          const result = await getVolunteerProfile();
          if (result.success && result.data) {
            setVolunteerProfile({
              firstName: result.data.firstName || undefined,
              lastName: result.data.lastName || undefined,
              interests: result.data.interestNames || [],
              skills: result.data.skillNames || [],
              bio: result.data.bio || undefined,
              userImage: result.data.userImage || undefined,
              location: result.data.address || undefined,
            });
          }
        } catch (error) {
          console.error('Failed to fetch volunteer profile:', error);
        }
      }
    };

    fetchVolunteerProfile();
  }, [user?.accountType, user?.interests, getVolunteerProfile, setVolunteerProfile]);

  // Reflect the applied filters/page into the URL query params so the
  // current view can be shared as a link
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const sync = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };
    sync("search", filters.search.trim());
    sync("date", filters.date);
    sync("location", filters.location);
    sync("interest", filters.interest);
    sync("foundation", filters.foundation);
    sync("page", page > 1 ? String(page) : "");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [filters, page, pathname, router]);

  // Fetch a page of programs — search/dateRange/foundationId and pagination
  // are handled server-side via the get-programs query params
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const params: {
          search?: string;
          dateRange?: string;
          foundationId?: string;
          pageNumber: number;
          pageSize: number;
        } = { pageNumber: page, pageSize: PAGE_SIZE };

        if (filters.search.trim()) params.search = filters.search.trim();
        if (filters.date) params.dateRange = toDateRangeParam(filters.date);
        if (filters.foundation) {
          const foundationId = Object.entries(foundations).find(
            ([, name]) => name === filters.foundation
          )?.[0];
          if (foundationId) params.foundationId = foundationId;
        }

        const response = await getProgramsAction(params);

        if (response.success && response.data) {
          const apiPrograms = response.data as ProgramApiResponse[];
          // Map API response to ProgramItem interface
          const mappedPrograms = apiPrograms.map((program: ProgramApiResponse): ProgramItem => ({
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
            foundationId: program.foundationId,
            organization: program.organization || program.organizationName || '',
            isFavourited: false,
            duration: program.duration || '',
            targetVolunteers: program.targetVolunteers || 0,
          }));
          setPrograms(mappedPrograms);
          setPagination(response.pagination ?? null);

          // Remember every foundation seen so the dropdown keeps its options
          // across pages and while a foundation filter is applied
          setFoundations((prev) => {
            let changed = false;
            const next = { ...prev };
            for (const program of apiPrograms) {
              const name = program.organization || program.organizationName || "";
              if (program.foundationId && name && !next[program.foundationId]) {
                next[program.foundationId] = name;
                changed = true;
              }
            }
            return changed ? next : prev;
          });
        } else {
          // If API fails, treat as empty state (endpoint might not exist yet)
          setPrograms([]);
          setPagination(null);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        // Treat errors as empty state instead of showing error
        setPrograms([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
    // `foundations` is intentionally not a dependency: it is only used to
    // translate the selected foundation name into an id and is updated after
    // each fetch, which would otherwise loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // Snap back if the current page no longer exists after a filter change
  useEffect(() => {
    if (pagination && pagination.totalPages >= 1 && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination, page]);

  const filteredPrograms = useMemo(
    () => filterPrograms(programs, filters),
    [programs, filters]
  );

  const foundationOptionList = useMemo(
    () =>
      Array.from(new Set(Object.values(foundations))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [foundations]
  );

  const handleApplyFilters = (next: ProgramFilters) => {
    setFilters(next);
    setPage(1);
  };

  // Favourite state for the heart icons — hydrated from the favorites API
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await getFavoriteProgramsAction();
      if (response.success && response.data) {
        setFavoriteIds(new Set(response.data.map((program) => program.id)));
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (program: ProgramItem, next: boolean) => {
    const programId = program.id;
    // Optimistic update, rolled back on failure
    setFavoriteIds((prev) => {
      const updated = new Set(prev);
      if (next) updated.add(programId);
      else updated.delete(programId);
      return updated;
    });

    const response = next
      ? await addFavoriteProgramAction(programId)
      : await removeFavoriteProgramAction(programId);

    if (!response.success) {
      setFavoriteIds((prev) => {
        const updated = new Set(prev);
        if (next) updated.delete(programId);
        else updated.add(programId);
        return updated;
      });
      toast.error(response.error || "Failed to update favourites");
    }
  };

  const displayName = user?.firstName || volunteerData?.formData?.bioData?.firstName || user?.email?.split('@')[0] || 'Volunteer';

  const hasActiveFilters = Object.values(filters).some(Boolean);

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
        {/* Total count stats bar */}
        <div className="flex items-center gap-3 px-1 text-sm">
          <span className="font-semibold text-gray-700">
            {pagination?.totalCount ?? 0} programs available
          </span>
          {hasActiveFilters && (
            <>
              <span className="w-px h-3 bg-gray-300 mx-1" />
              <span className="text-[#0E68DC] font-medium">
                {filteredPrograms.length} showing on this page
              </span>
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Top Bar */}
      <SearchBar
        filters={filters}
        onApply={handleApplyFilters}
        programs={programs}
        foundationOptions={foundationOptionList}
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
      {!isLoading && filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm mb-4">
            {hasActiveFilters
              ? "No programs found matching your criteria."
              : "No programs available at the moment."}
          </div>
          {hasActiveFilters && (
            <AppButton
              text="Clear Filters"
              onClick={() => setFilters({ ...EMPTY_PROGRAM_FILTERS })}
              className="!mt-4 !text-sm !px-4 !py-2 !rounded-md"
            />
          )}
        </div>
      )}

      {/* Program Cards Grid */}
      {!isLoading && filteredPrograms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isFavourited={favoriteIds.has(program.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}
    </motion.section>
  );
}
