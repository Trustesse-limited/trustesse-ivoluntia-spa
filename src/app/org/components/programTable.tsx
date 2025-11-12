"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ProgramItem } from "@/types";
import { formatNumberWithCommas } from "@/lib/utils";

type ProgramTableProps = {
  data: ProgramItem[];
  onViewDetails?: (program: ProgramItem, index: number) => void;
};

export default function ProgramTable({
  data,
  onViewDetails,
}: ProgramTableProps) {
  const router = useRouter();

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
            <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
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
              <td className="w-[120px] px-4 py-2 whitespace-nowrap text-center">
                <button
                  onClick={() =>
                    onViewDetails
                      ? onViewDetails(program, index)
                      : router.push(`/org/programs/${index}`)
                  }
                  className="px-4 py-2 text-sm bg-[#0E68DC] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
