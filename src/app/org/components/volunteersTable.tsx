"use client";
import React, { useState } from "react";
import { Volunteer } from "@/types";



type VolunteerTableProps = {
  data: Volunteer[];
  onRemove?: (volunteer: Volunteer, index: number) => void;
};

export default function VolunteerTable({
  data,
  onRemove,
}: VolunteerTableProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleRemoveClick = (index: number) => {
    setSelectedIndex(index);
    if (onRemove) onRemove(data[index], index);
  };

  return (
    <div className="max-md:w-[86vw] w-[calc(90vw-13rem)] xl:w-full overflow-x-auto">
      <table className="min-w-full border border-gray-300 table-fixed">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#818181] whitespace-nowrap">
              Volunteer Name
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Location
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Email
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Phone Number
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181] whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((volunteer, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-sm text-[#373737] whitespace-nowrap">
                {volunteer.name}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                {volunteer.location}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                {volunteer.email}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                {volunteer.phone}
              </td>
              <td className="px-4 py-2 text-sm text-center font-semibold whitespace-nowrap">
                <span
                  className={
                    volunteer.status === "active"
                      ? "text-[#66BB6A]"
                      : volunteer.status === "inactive"
                      ? "text-[#818181]"
                      : "text-[#F7BA32]"
                  }
                >
                  {volunteer.status.charAt(0).toUpperCase() +
                    volunteer.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-2 text-center whitespace-nowrap">
                <button
                  onClick={() => handleRemoveClick(index)}
                  className="px-4 py-2 text-sm bg-[#EF5350] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
