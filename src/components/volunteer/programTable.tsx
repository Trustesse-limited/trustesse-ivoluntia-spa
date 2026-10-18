"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramItem } from "@/types";
import { formatNumberWithCommas } from "@/lib/utils";
import { joinProgramAction } from "@/app/actions/auth";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type ProgramTableProps = {
  data: ProgramItem[];
  onViewDetails?: (program: ProgramItem, index: number) => void;
  onEnroll?: (program: ProgramItem, index: number) => void;
  showEnrollButton?: boolean;
  showStatus?: boolean;
  showProgress?: boolean;
  showCertificate?: boolean;
  isLoading?: boolean;
};

export default function ProgramTable({
  data,
  onViewDetails,
  onEnroll,
  showEnrollButton = false,
  showStatus = false,
  showProgress = false,
  showCertificate = false,
  isLoading = false,
}: ProgramTableProps) {
  const router = useRouter();
  const [enrollingIndex, setEnrollingIndex] = useState<number | null>(null);

  const handleEnrollClick = async (index: number) => {
    setEnrollingIndex(index);
    try {
      const program = data[index];
      // Join must go through a server action: calling the API directly from
      // the browser fails CORS (wildcard Access-Control-Allow-Origin with
      // credentialed requests is rejected by the browser)
      const response = await joinProgramAction(program.id);
      if (response.success) {
        toast.success('Successfully enrolled in program');
        onEnroll?.(program, index);
      } else {
        toast.error('Failed to enroll in program');
      }
    } catch (error) {
      console.error('Error enrolling in program:', error);
      toast.error('Failed to enroll in program');
    } finally {
      setEnrollingIndex(null);
    }
  };

  const getProgressWidth = (program: ProgramItem) => {
    // Calculate progress based on dates or other logic
    const now = new Date();
    const start = new Date(program.startDate);
    const end = new Date(program.endDate);
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-md:w-[80vw] w-[calc(90vw-13rem)] overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="w-[180px] px-4 py-3 text-left text-sm font-semibold text-[#818181] whitespace-nowrap">
              Program Name
            </th>
            <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Start Date
            </th>
            <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              End Date
            </th>
            <th className="w-[160px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Location
            </th>
            <th className="w-[140px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Donation Target
            </th>
            {showStatus && (
              <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
                Status
              </th>
            )}
            {showProgress && (
              <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
                Progress
              </th>
            )}
            <th className="w-[160px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            [1, 2, 3].map((row) => (
              <tr key={row} className="bg-white">
                <td className="w-[180px] px-4 py-2 whitespace-nowrap overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="h-4 w-full max-w-[140px] bg-shimmer animate-shimmer rounded-sm"
                  />
                </td>
                <td className="w-[120px] px-4 py-2 whitespace-nowrap text-center">
                  <div
                    aria-hidden="true"
                    className="h-4 w-[72px] mx-auto bg-shimmer animate-shimmer rounded-sm"
                  />
                </td>
                <td className="w-[120px] px-4 py-2 whitespace-nowrap text-center">
                  <div
                    aria-hidden="true"
                    className="h-4 w-[72px] mx-auto bg-shimmer animate-shimmer rounded-sm"
                  />
                </td>
                <td className="w-[160px] px-4 py-2 whitespace-nowrap text-center">
                  <div
                    aria-hidden="true"
                    className="h-4 w-[112px] mx-auto bg-shimmer animate-shimmer rounded-sm"
                  />
                </td>
                <td className="w-[140px] px-4 py-2 whitespace-nowrap text-center">
                  <div
                    aria-hidden="true"
                    className="h-4 w-[84px] mx-auto bg-shimmer animate-shimmer rounded-sm"
                  />
                </td>
                {showStatus && (
                  <td className="w-[120px] px-4 py-2 whitespace-nowrap text-center">
                    <div
                      aria-hidden="true"
                      className="h-4 w-[60px] mx-auto bg-shimmer animate-shimmer rounded-sm"
                    />
                  </td>
                )}
                {showProgress && (
                  <td className="w-[120px] px-4 py-2 whitespace-nowrap text-center">
                    <div aria-hidden="true" className="flex flex-col items-center gap-1">
                      <div
                        aria-hidden="true"
                        className="h-2 w-full max-w-[60px] bg-shimmer animate-shimmer rounded-full"
                      />
                      <div
                        aria-hidden="true"
                        className="h-3 w-[24px] bg-shimmer animate-shimmer rounded-sm"
                      />
                    </div>
                  </td>
                )}
                <td className="w-[160px] px-4 py-2 whitespace-nowrap text-center">
                  <div aria-hidden="true" className="flex justify-center gap-2">
                    <div
                      aria-hidden="true"
                      className="h-8 w-[120px] bg-shimmer animate-shimmer rounded-[6px]"
                    />
                    {showEnrollButton && (
                      <div
                        aria-hidden="true"
                        className="h-8 w-[120px] bg-shimmer animate-shimmer rounded-[6px]"
                      />
                    )}
                    {showCertificate && (
                      <div
                        aria-hidden="true"
                        className="h-8 w-[120px] bg-shimmer animate-shimmer rounded-[6px]"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            data.map((program, index) => (
              <tr key={index}>
              <td className="w-[180px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap overflow-hidden">
                <span className="block truncate text-left w-50">
                  {program.title}
                </span>
              </td>
              <td className="w-[120px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap text-center">
                {formatDate(program.startDate)}
              </td>
              <td className="w-[120px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap text-center">
                {formatDate(program.endDate)}
              </td>
              <td className="w-[160px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap text-center">
                {program.location}
              </td>
              <td className="w-[140px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap text-center">
                {formatNumberWithCommas(program.donationTarget)}
              </td>
              {showStatus && (
                <td className="w-[120px] px-4 py-2 text-sm text-center font-semibold whitespace-nowrap">
                  <span
                    className={
                      program.status === "completed"
                        ? "text-[#66BB6A]"
                        : program.status === "forfeited"
                        ? "text-[#818181]"
                        : "text-[#F7BA32]"
                    }
                  >
                    {program.status === "completed"
                      ? "Completed"
                      : program.status === "forfeited"
                      ? "Forfeited"
                      : "Active"}
                  </span>
                </td>
              )}
              {showProgress && (
                <td className="w-[120px] px-4 py-2 text-sm text-center whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0E68DC] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressWidth(program)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {Math.round(getProgressWidth(program))}%
                  </span>
                </td>
              )}
              <td className="w-[160px] px-4 py-2 whitespace-nowrap text-center space-x-2">
                <button
                  onClick={() =>
                    onViewDetails
                      ? onViewDetails(program, index)
                      : router.push(`/programs/${index}`)
                  }
                  className="px-4 py-2 text-sm bg-[#0E68DC] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                >
                  View Details
                </button>
                {showEnrollButton && (
                  <button
                    onClick={() => handleEnrollClick(index)}
                    disabled={enrollingIndex === index}
                    className="px-4 py-2 text-sm bg-[#66BB6A] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer disabled:opacity-50 inline-flex items-center justify-center"
                  >
                    {enrollingIndex === index ? (
                      <>
                        Enroll
                        <LoadingSpinner size="sm" opacity={0.9} withSpacing={true} />
                      </>
                    ) : (
                      "Enroll"
                    )}
                  </button>
                )}
                {showCertificate && program.status === "completed" && (
                  <button
                    onClick={() => router.push(`/programs/${index}/certificate`)}
                    className="px-4 py-2 text-sm bg-[#9C27B0] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                  >
                    Certificate
                  </button>
                )}
              </td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}
