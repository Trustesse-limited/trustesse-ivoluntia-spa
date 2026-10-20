"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgramTable from "@/components/organization/programTable";
import Pagination from "@/components/ui/Pagination";
import { ProgramItem } from "@/types";
import { ProgramApiResponse } from "@/types/api";
import { getProgramsAction, getProgramStatsAction } from "@/app/actions/auth";
import { useActiveTab } from "@/hooks/useActiveTab";
import { useAuthStore } from "@/store";
import { motion } from "framer-motion";
import { AppButton } from "@/components/AppButton";
import { formatProgramLocation, normalizeProgramStatus } from "@/lib/utils";
import { FiSearch, FiX } from "react-icons/fi";

type TabKey = "pending" | "active" | "history";

const PROGRAM_TAB_IDS = ["pending", "active", "history"] as const;

const PROGRAM_TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending Programs" },
  { key: "active", label: "Active Programs" },
  { key: "history", label: "History" },
];

/** Programs per page in the table */
const PAGE_SIZE = 10;

/**
 * The API's `status` query takes a single value, but History spans three
 * statuses (completed/forfeited/cancelled). That tab fetches a broad slice
 * without a status filter and pages it locally.
 */
const HISTORY_STATUSES = ["completed", "forfeited", "cancelled"];
const HISTORY_FETCH_SIZE = 100;

/**
 * Read the stats counts from the get-program-stats payload. The response
 * shape is undocumented, so common key spellings are tried.
 */
function parseProgramStats(data: Record<string, unknown>): {
  total?: number;
  active?: number;
  pending?: number;
} {
  const pick = (keys: string[]): number | undefined => {
    for (const key of keys) {
      const found = Object.keys(data).find(
        (k) => k.toLowerCase() === key.toLowerCase()
      );
      if (found && typeof data[found] === "number") return data[found];
    }
    return undefined;
  };

  return {
    total: pick(["totalPrograms", "total", "totalCount", "programsCount"]),
    active: pick(["activePrograms", "active", "activeCount"]),
    pending: pick(["pendingPrograms", "pending", "pendingCount"]),
  };
}

export default function ProgramsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const foundationId = user?.foundationId;
  // Active tab is persisted in the URL (?tab=...) so it survives refresh
  const [activeTab, setActiveTab] = useActiveTab<TabKey>("pending", PROGRAM_TAB_IDS);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    total?: number;
    active?: number;
    pending?: number;
  }>({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats come from the dedicated get-program-stats endpoint — the old
  // list-derived counts break once the list is paginated
  useEffect(() => {
    const id = foundationId;
    if (!id) return;
    let cancelled = false;

    const fetchStats = async () => {
      const response = await getProgramStatsAction(id);
      if (!cancelled && response.success && response.data) {
        setStats(parseProgramStats(response.data));
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [foundationId]);

  // Fetch the current tab's page — pending/active use the API's status param
  // with server-side pagination; history is filtered client-side (the status
  // param only accepts a single value but history spans three statuses)
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        // Programs endpoints must go through server actions: calling the API
        // directly from the browser fails CORS (backend returns a wildcard
        // Access-Control-Allow-Origin, which is invalid with credentials)
        // Scope to this organization's programs when the foundation id is
        // known — without it the endpoint returns every organization's
        // programs (hundreds of rows), which is slow and leaks other orgs' data
        const response = await getProgramsAction({
          foundationId,
          status: activeTab !== "history" ? activeTab : undefined,
          search: searchQuery || undefined,
          pageNumber: page,
          pageSize: activeTab === "history" ? HISTORY_FETCH_SIZE : PAGE_SIZE,
        });

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
            foundationId: program.foundationId,
            organization: program.organization || program.organizationName || '',
            isFavourited: false,
            duration: program.duration || '',
            targetVolunteers: program.targetVolunteers || 0,
          }));
          // Defense in depth: if the backend ignores the foundationId param,
          // filter client-side so an organization only ever sees its own programs
          const visiblePrograms = foundationId
            ? mappedPrograms.filter(p => !p.foundationId || p.foundationId === foundationId)
            : mappedPrograms;

          if (activeTab === "history") {
            // Narrow the broad fetch to the history statuses and page locally
            const historyPrograms = visiblePrograms.filter(p =>
              HISTORY_STATUSES.includes(p.status?.toLowerCase() || '')
            );
            setPrograms(historyPrograms);
            setTotalPages(Math.max(1, Math.ceil(historyPrograms.length / PAGE_SIZE)));
          } else {
            setPrograms(visiblePrograms);
            setTotalPages(response.pagination?.totalPages ?? 1);
          }
        } else {
          setPrograms([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setPrograms([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [activeTab, page, foundationId, searchQuery]);

  // History rows are already limited to the HISTORY_FETCH_SIZE slice and
  // paged locally; the other tabs page server-side
  const pagedPrograms =
    activeTab === "history"
      ? programs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      : programs;

  const tabs = PROGRAM_TABS;

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  const getEmptyMessage = () =>
    activeTab === "history"
      ? "No history yet"
      : "You do not have any Programs. Create a program to start engaging volunteers and make an impact";

  const statCards: { title: string; value: number | undefined }[] = [
    { title: "Total Programs", value: stats.total },
    { title: "Active Programs", value: stats.active },
    { title: "Pending Programs", value: stats.pending },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }} className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            Programs Management
          </h1>
          <p className="text-sm text-black break-words">
            Plan, publish and track programs in one place
          </p>
        </div>
        <div className="flex justify-center justify-end w-full sm:w-auto">
          <AppButton
            text="Create New Program"
            onClick={() => router.push("/org/programs/create")}
            className="!py-2 !px-4 !text-sm"
          />
        </div>
      </div>

      {/* Stats — from the dedicated get-program-stats endpoint */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 flex flex-col justify-between w-full"
          >
            <h2 className="text-sm font-medium text-black">{stat.title}</h2>
            <p className="text-4xl font-bold text-gray-900 mt-4">
              {stat.value ?? "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* Tabs Navigation */}
        <div className="relative mb-6">
          <div className="max-sm:w-[80vw] w-full relative">
            <div className="flex w-full max-sm:gap-4 gap-6 border-b max-sm:overflow-x-auto scrollbar-hide whitespace-nowrap border-gray-200 px-4 sm:px-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`pb-3 text-[14px] cursor-pointer font-medium transition border-b-2 w-fit ${
                    activeTab === tab.key
                      ? "text-[#0E68DC] border-[#42A5F5]"
                      : "text-black border-transparent hover:text-[#0E68DC]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          {/* Search field - responsive width */}
          <div className="relative flex-1 min-w-50 max-w-md">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search programs…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSearchQuery(searchInput);
                  setPage(1);
                }
              }}
              className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E68DC]/50 focus:border-transparent transition-all cursor-text"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search text"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search button */}
          <button
            type="button"
            onClick={() => {
              setSearchQuery(searchInput);
              setPage(1);
            }}
            className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium shadow-md hover:bg-[#0a55b0] transition-all hover:shadow-lg cursor-pointer"
          >
            <FiSearch className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <ProgramTable
            data={[]}
            isLoading
            showStatus={activeTab === "history"}
            showDeleteButton={activeTab === "history"}
          />
        ) : pagedPrograms.length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            {getEmptyMessage()}
          </div>
        ) : activeTab === "history" ? (
          <>
            <ProgramTable data={pagedPrograms} showDeleteButton showStatus/>
            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {<ProgramTable data={pagedPrograms} />}
            </div>
            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </motion.section>
  );
}
