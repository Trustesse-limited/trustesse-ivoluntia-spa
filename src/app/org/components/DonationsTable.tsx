"use client";
import React from "react";
import { Donor } from "@/types";

type DonationsTableProps = {
  data: Donor[];
  onViewComment: (donor: Donor, index: number) => void;
};

export default function DonationsTable({
  data,
  onViewComment,
}: DonationsTableProps) {
  return (
    <div className="max-md:w-[86vw] w-[calc(90vw-13rem)] xl:w-full overflow-x-auto">
      <table className="min-w-full border border-gray-300 table-fixed">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#818181]">
              Donor Name
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181]">
              Email
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181]">
              Amount
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181]">
              Date
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap text-[#818181]">
              Payment Method
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181]">
              Status
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#818181]">
              Comment
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((donor, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-sm text-[#373737] whitespace-nowrap">
                {donor.name}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                {donor.email}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                ₦{donor.amount.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                {donor.date}
              </td>
              <td className="px-4 py-2 text-sm text-[#373737] text-center whitespace-nowrap">
                {donor.paymentMethod}
              </td>
              <td className="px-4 py-2 text-sm text-center font-semibold whitespace-nowrap">
                <span
                  className={
                    donor.status === "successful"
                      ? "text-[#66BB6A]"
                      : donor.status === "failed"
                      ? "text-[#EF5350]"
                      : "text-[#F7BA32]"
                  }
                >
                  {donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-2 text-center whitespace-nowrap">
                <button
                  onClick={() => onViewComment(donor, index)}
                  className="px-4 py-2 text-sm bg-[#0E68DC] text-white rounded-[6px] hover:opacity-90 transition-class cursor-pointer"
                >
                  View Comment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
