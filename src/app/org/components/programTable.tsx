"use client";
import React from "react";
import { useRouter } from "next/navigation";

export type ProgramItem = {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  donationTarget: string;
  description?: string;
};

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
    <div className="max-sm:w-[80vw] w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[180px] px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              Program Name
            </th>
            <th className="w-[120px] px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              Start Date
            </th>
            <th className="w-[120px] px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              End Date
            </th>
            <th className="w-[160px] px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              Location
            </th>
            <th className="w-[140px] px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              Donation Target
            </th>
            <th className="w-[120px] px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-center">
          {data.map((program, index) => (
            <tr key={index}>
              <td className="w-[180px] px-4 py-2 text-sm text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis text-center">
                <span className="block truncate">{program.title}</span>
              </td>
              <td className="w-[120px] px-4 py-2 text-sm text-gray-700 whitespace-nowrap text-center">
                {program.startDate}
              </td>
              <td className="w-[120px] px-4 py-2 text-sm text-gray-700 whitespace-nowrap text-center">
                {program.endDate}
              </td>
              <td className="w-[160px] px-4 py-2 text-sm text-gray-700 whitespace-nowrap text-center">
                {program.location}
              </td>
              <td className="w-[140px] px-4 py-2 text-sm text-gray-700 whitespace-nowrap text-center">
                {program.donationTarget}
              </td>
              <td className="w-[120px] px-4 py-2 whitespace-nowrap text-center">
                <button
                  onClick={() =>
                    onViewDetails
                      ? onViewDetails(program, index)
                      : router.push(`/org/programs/${index}`)
                  }
                  className="px-3 py-1 text-sm bg-[#0E68DC] text-white rounded hover:opacity-90 transition-class"
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
