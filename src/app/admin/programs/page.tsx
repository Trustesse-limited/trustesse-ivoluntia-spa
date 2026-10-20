"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProgramItem } from "@/types";
import { ProgramApiResponse } from "@/types/api";
import { getProgramsAction, getOrganizationsAction, updateProgramStatusAction } from "@/app/actions/auth";
import { useActiveTab } from "@/hooks/useActiveTab";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { AppButton } from "@/components/AppButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatProgramLocation, normalizeProgramStatus } from "@/lib/utils";
import { FiSearch, FiX } from "react-icons/fi";
import Pagination from "@/components/ui/Pagination";

type TabKey = "pending" | "active" | "history";

const PROGRAM_TAB_IDS = ["pending", "active", "history"] as const;

const PROGRAM_TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending Programs" },
  { key: "active", label: "Active Programs" },
  { key: "history", label: "History" },
];

export default function AdminProgramsPage() {
  // Active tab is persisted in the URL (?tab=...) so it survives refresh
  const [activeTab, setActiveTab] = useActiveTab<TabKey>("pending", PROGRAM_TAB_IDS);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  // Organizations dropdown options
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        // Programs endpoints must go through server actions: calling the API
        // directly from the browser fails CORS (backend returns a wildcard
        // Access-Control-Allow-Origin, which is invalid with credentials)
        const response = await getProgramsAction({
          foundationId: organizationFilter || undefined,
          search: searchQuery || undefined,
          pageNumber,
          pageSize,
        });
        
        if (response.success && response.data) {
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
          if (response.pagination) {
            setTotalCount(response.pagination.totalCount);
            setTotalPages(response.pagination.totalPages);
            setPageNumber(response.pagination.pageNumber);
          }
        } else {
          setPrograms([]);
          setTotalCount(0);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setPrograms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [pageNumber, pageSize, searchQuery, organizationFilter]);

  // Fetch organizations for the filter dropdown
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoadingOrganizations(true);
        const response = await getOrganizationsAction({
          Page: 1,
          PageSize: 100,
          All: true,
        });
        if (response.success && response.data) {
          const raw = response.data as Record<string, unknown>;
          const items = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
          setOrganizations(
            items
              .filter((item: Record<string, unknown>) => item?.id && item?.name)
              .map((item: Record<string, unknown>) => ({
                id: String(item.id),
                name: String(item.name),
              }))
          );
        }
      } catch (err) {
        console.error('Error fetching organizations:', err);
      } finally {
        setIsLoadingOrganizations(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredByOrg = organizationFilter
    ? programs.filter(p => p.organization === organizationFilter)
    : programs;

  const programData: Record<TabKey, ProgramItem[]> = {
    pending: filteredByOrg.filter(p => p.status?.toLowerCase() === 'pending'),
    active: filteredByOrg.filter(p => p.status?.toLowerCase() === 'active'),
    history: filteredByOrg.filter(p => ['completed', 'forfeited', 'cancelled'].includes(p.status?.toLowerCase() || '')),
  };

  const tabs = PROGRAM_TABS;

  const getEmptyMessage = () =>
    activeTab === "history"
      ? "No history yet"
      : "No programs found";

  const handleStatusUpdate = async () => {
    if (!selectedProgram || !newStatus) return;

    try {
      setIsUpdating(true);
      const response = await updateProgramStatusAction({
        programId: selectedProgram.id,
        status: newStatus,
        queriedComment: comment,
      });

      if (response.success) {
        toast.success('Program status updated successfully');
        setPrograms(prev => prev.map(p => 
          p.id === selectedProgram.id ? { ...p, status: normalizeProgramStatus(newStatus) } : p
        ));
        setShowStatusModal(false);
        setSelectedProgram(null);
        setNewStatus('');
        setComment('');
      } else {
        toast.error(response.error || 'Failed to update program status');
      }
    } catch (error) {
      console.error('Error updating program status:', error);
      toast.error('Failed to update program status');
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusModal = (program: ProgramItem) => {
    setSelectedProgram(program);
    setNewStatus(program.status);
    setComment('');
    setShowStatusModal(true);
  };

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
            Manage and oversee all programs across the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Programs", value: totalCount, color: "bg-blue-500" },
          { title: "Active Programs", value: programs.filter(p => p.status?.toLowerCase() === 'active').length, color: "bg-green-500" },
          { title: "Pending Programs", value: programs.filter(p => p.status?.toLowerCase() === 'pending').length, color: "bg-yellow-500" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 flex flex-col justify-between w-full"
          >
            <h2 className="text-sm font-medium text-black">{stat.title}</h2>
            <p className="text-4xl font-bold text-gray-900 mt-4">
              {stat.value}
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
                  onClick={() => setActiveTab(tab.key)}
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

        {/* Filters - Search and Organization */}
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
                  setPageNumber(1);
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
              setPageNumber(1);
            }}
            className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium shadow-md hover:bg-[#0a55b0] transition-all hover:shadow-lg cursor-pointer"
          >
            <FiSearch className="w-4 h-4" />
            <span>Search</span>
          </button>

          {/* Organization filter - responsive width */}
          <div className="flex-1 min-w-37.5 max-w-xs">
            <select
              value={organizationFilter}
              onChange={(e) => {
                setOrganizationFilter(e.target.value);
                setPageNumber(1);
              }}
              disabled={isLoadingOrganizations}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0E68DC]/50 focus:border-transparent transition-all cursor-pointer appearance-none bg-white"
            >
              <option value="">All Organizations</option>
              {isLoadingOrganizations ? (
                <option disabled>Loading organizations...</option>
              ) : (
                organizations.map((org) => (
                  <option key={org.id} value={org.name}>
                    {org.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="xl" opacity={0.8} />
          </div>
        ) : programData[activeTab].length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            {getEmptyMessage()}
          </div>
        ) : (
            <>
          <div className="max-md:w-[80vw] w-[calc(90vw-13rem)] overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-[#F7F7F7]">
                <tr>
                  <th className="w-[180px] px-4 py-3 text-left text-sm font-semibold text-[#000000] whitespace-nowrap">
                    Program Name
                  </th>
                  <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                    End Date
                  </th>
                  <th className="w-[160px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                    Location
                  </th>
                  <th className="w-[140px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                    Organization
                  </th>
                  <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                    Status
                  </th>
                  <th className="w-[160px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {programData[activeTab].map((program, index) => (
                  <tr key={index}>
                    <td className="w-[180px] px-4 py-2 text-sm text-[#000000] whitespace-nowrap overflow-hidden">
                      <span className="block truncate text-left w-50">
                        {program.title}
                      </span>
                    </td>
                    <td className="w-[120px] px-4 py-2 text-sm text-[#000000] whitespace-nowrap text-center">
                      {program.startDate}
                    </td>
                    <td className="w-[120px] px-4 py-2 text-sm text-[#000000] whitespace-nowrap text-center">
                      {program.endDate}
                    </td>
                    <td className="w-[160px] px-4 py-2 text-sm text-[#000000] whitespace-nowrap text-center">
                      {program.location}
                    </td>
                    <td className="w-[140px] px-4 py-2 text-sm text-[#000000] whitespace-nowrap text-center">
                      {program.organization}
                    </td>
                    <td className="w-[120px] px-4 py-2 text-sm text-center font-semibold whitespace-nowrap">
                      <span
                        className={
                          program.status === "completed"
                            ? "text-[#66BB6A]"
                            : program.status === "forfeited"
                            ? "text-[#000000]"
                            : program.status === "active"
                            ? "text-[#66BB6A]"
                            : "text-[#F7BA32]"
                        }
                      >
                        {program.status === "completed"
                          ? "Completed"
                          : program.status === "forfeited"
                          ? "Forfeited"
                          : program.status === "active"
                          ? "Active"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="w-[160px] px-4 py-2 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => openStatusModal(program)}
                        className="px-4 py-2 text-sm bg-[#0E68DC] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            onPageChange={setPageNumber}
            isLoading={isLoading}
          />
            </>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Update Program Status
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedProgram?.title}
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Forfeited">Forfeited</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Add a comment about this status change..."
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <AppButton
              text="Cancel"
              onClick={() => setShowStatusModal(false)}
              className="!bg-gray-200 hover:!bg-gray-300 !text-gray-800 !py-3 !px-8 !rounded-xl !text-base !font-medium"
            />
            <AppButton
              text="Update Status"
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              className="!bg-[#0E68DC] hover:!bg-[#0E68DC] !py-3 !px-8 !rounded-xl !text-base !font-medium"
            />
          </div>
        </div>
      </Modal>
    </motion.section>
  );
}
