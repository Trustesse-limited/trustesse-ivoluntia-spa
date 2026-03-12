"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramItem } from "@/types";
import { formatNumberWithCommas } from "@/lib/utils";
import DeleteModal from "../programs/components/modals/deleteProgram";

type ProgramTableProps = {
  data: ProgramItem[];
  onViewDetails?: (program: ProgramItem, index: number) => void;
  onDelete?: (program: ProgramItem, index: number) => void;
  showDeleteButton?: boolean;
  showStatus?: boolean;
};

export default function ProgramTable({
  data,
  onViewDetails,
  onDelete,
  showDeleteButton = false,
  showStatus = false,
}: ProgramTableProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProgramIndex, setSelectedProgramIndex] = useState<
    number | null
  >(null);

  const handleDeleteClick = (index: number) => {
    setSelectedProgramIndex(index);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProgramIndex !== null) {
      const program = data[selectedProgramIndex];
      onDelete?.(program, selectedProgramIndex);
    }
    setShowDeleteModal(false);
    setSelectedProgramIndex(null);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedProgramIndex(null);
  };

  return (
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
                Donation Target
              </th>
              {showStatus && (
                <th className="w-[120px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                  Status
                </th>
              )}
              <th className="w-[160px] px-4 py-3 text-center text-sm font-semibold text-[#000000] whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((program, index) => (
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
                  {formatNumberWithCommas(program.donationTarget)}
                </td>
                {showStatus && (
                  <td className="w-[120px] px-4 py-2 text-sm text-center font-semibold whitespace-nowrap">
                    <span
                      className={
                        program.status === "completed"
                          ? "text-[#66BB6A]"
                          : program.status === "forfeited"
                          ? "text-[#000000]"
                          : "text-[#F7BA32]"
                      }
                    >
                      {program.status === "completed"
                        ? "Completed"
                        : program.status === "forfeited"
                        ? "Forfeited"
                        : "Pending"}
                    </span>
                  </td>
                )}
                <td className="w-[160px] px-4 py-2 whitespace-nowrap text-center space-x-10">
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
                  {showDeleteButton && (
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="px-4 py-2 text-sm bg-[#EF5350] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
