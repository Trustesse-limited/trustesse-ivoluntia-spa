"use client";
import React from "react";
import { useParams } from "next/navigation";
import { programs } from "@/lib/mockData";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import Image from "next/image";
import ProgramNotFound from "../components/programNotFound";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const program = programs.find((_, index) => index.toString() === id);

  if (!program) {
    return (
      <ProgramNotFound />
    );
  }

  const isActive = () => {
    const now = new Date();
    const start = new Date(program.startDate);
    const end = new Date(program.endDate);
    return now >= start && now <= end;
  };

  const progressPercent = Math.min(
    (program.raised / program.donationTarget) * 100,
    100
  );

  return (
    <section className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 bg-white text-black">
      <h1 className="text-xl font-bold ">Program Overview</h1>

      {/* Image */}
      <div className="w-full rounded-lg overflow-hidden">
        <Image
          src={program.image}
          alt={program.title}
          width={1200}
          height={600}
          className="w-full h-60 lg:h-80 object-cover rounded-md"
        />
      </div>

      {/* Title flex */}
      <div className="flex items-center justify-start gap-6 w-full flex-wrap">
        <h2 className="text-xl font-bold ">{program.title}</h2>
        <span
          className={`inline-block py-3 px-4 text-xs font-medium rounded-[8px] ${
            isActive()
              ? "bg-[#F3F3F3] text-[#66BB6A]"
              : "bg-[#F3F3F3] text-[#F7BA32]"
          }`}
        >
          {isActive() ? "Active" : "Pending"}
        </span>
        <button className="bg-[var(--buttonPrimary)] rounded-[8px] text-white text-sm font-medium ml-auto p-3 cursor-pointer hover:opacity-90 transition-class">
          Edit Program
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 gap-3 relative -top-4 text-sm text-[#373737]">
        <div className="font-medium text-base">{program.category}</div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          {program.startDate} – {program.endDate}
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin className="text-gray-500" />
          {program.location}
        </div>
        <div className="flex items-center gap-2">
          <FiUsers className="text-gray-500" />
          200 Volunteers
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 lg:w-8/12">
        <h3 className="text-lg font-bold ">Description</h3>
        <p className="text-sm  whitespace-pre-line">{program.description}</p>
      </div>

      {/* Donation Target */}
      <div className="space-y-2 lg:w-8/12">
        <h3 className="text-lg font-bold ">Donation Target</h3>
        <p className="text-smmt-1">
          ₦ {program.raised.toLocaleString()} Raised of ₦
          {program.donationTarget.toLocaleString()}
        </p>
        <div className="w-full bg-[#D9D9D9] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[#66BB6A] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold ">Goals</h3>
        <div className="text-sm rendered-list [&>ul]:list-disc pl-5">
          <div dangerouslySetInnerHTML={{ __html: program.goals }} />
        </div>
      </div>

      <div className="flex justify-end gap-4 w-full items-center">
        <button className="bg-[#C0C0C0] text-black text-sm font-medium rounded-[8px] py-2 px-4 cursor-pointer hover:opacity-90 transition">
          Forfeit
        </button>
        <button className="bg-[#EF5350] text-white text-sm font-medium rounded-[8px] py-2 px-4 cursor-pointer hover:opacity-90 transition">
          Delete
        </button>
      </div>
    </section>
  );
}
