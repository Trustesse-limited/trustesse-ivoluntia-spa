"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramItem } from "@/types";
import { formatNumberWithCommas } from "@/lib/utils";

type ProgramTableProps = {
  data: ProgramItem[];
  onViewDetails?: (program: ProgramItem, index: number) => void;
  onEnroll?: (program: ProgramItem, index: number) => void;
  showEnrollButton?: boolean;
  showStatus?: boolean;
  showProgress?: boolean;
  showCertificate?: boolean;
};

export default function ProgramTable({
  data,
  onViewDetails,
  onEnroll,
  showEnrollButton = false,
  showStatus = false,
  showProgress = false,
  showCertificate = false,
}: ProgramTableProps) {
  const router = useRouter();
  const [enrollingIndex, setEnrollingIndex] = useState<number | null>(null);

  const handleEnrollClick = async (index: number) => {
    setEnrollingIndex(index);
    // Simulate enrollment process
    await new Promise(resolve => setTimeout(resolve, 1000));
    onEnroll?.(data[index], index);
    setEnrollingIndex(null);
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
          {data.map((program, index) => (
            <tr key={index}>
              <td className="w-[180px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap overflow-hidden">
                <span className="block truncate text-left w-50">
                  {program.title}
                </span>
              </td>
              <td className="w-[120px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap text-center">
                {program.startDate}
              </td>
              <td className="w-[120px] px-4 py-2 text-sm text-[#818181] whitespace-nowrap text-center">
                {program.endDate}
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
                      : router.push(`/volunteer/programs/${index}`)
                  }
                  className="px-4 py-2 text-sm bg-[#0E68DC] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                >
                  View Details
                </button>
                {showEnrollButton && (
                  <button
                    onClick={() => handleEnrollClick(index)}
                    disabled={enrollingIndex === index}
                    className="px-4 py-2 text-sm bg-[#66BB6A] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer disabled:opacity-50"
                  >
                    {enrollingIndex === index ? "Enrolling..." : "Enroll"}
                  </button>
                )}
                {showCertificate && program.status === "completed" && (
                  <button
                    onClick={() => router.push(`/volunteer/programs/${index}/certificate`)}
                    className="px-4 py-2 text-sm bg-[#9C27B0] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                  >
                    Certificate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
