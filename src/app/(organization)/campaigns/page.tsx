"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProgramTable from "@/components/organization/programTable";
import { ProgramItem } from "@/types";
import { programs } from "@/lib/mockData";
import { motion } from "framer-motion";

type TabKey = "pending" | "active" | "history";

const programStats = [
  { title: "Total Programs", value: 0, color: "bg-blue-500" },
  { title: "Active Programs", value: 0, color: "bg-green-500" },
  { title: "Pending Programs", value: 0, color: "bg-yellow-500" },
];

export default function ProgramsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  const programData: Record<TabKey, ProgramItem[]> = {
    pending: [],
    active: programs,
    history: programs,
  };

  const tabs = [
    { key: "pending", label: "Pending Programs" },
    { key: "active", label: "Active Programs" },
    { key: "history", label: "History" },
  ];

  const getEmptyMessage = () =>
    activeTab === "history"
      ? "No history yet"
      : "You do not have any Programs. Create a program to start engaging volunteers and make an impact";

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
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <button
            onClick={() => router.push("/campaigns/create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--buttonPrimary)] text-sm text-white rounded-md hover:opacity-90 transition cursor-pointer"
          >
            <span className="text-lg font-bold">+</span> Create New Program
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programStats.map((stat) => (
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
                  onClick={() => setActiveTab(tab.key as TabKey)}
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

        {/* Tab Content */}
        {programData[activeTab].length === 0 ? (
          <div className="text-center text-gray-400 italic py-12">
            {getEmptyMessage()}
          </div>
        ) : activeTab === "history" ? (
          <ProgramTable data={programData.history} showDeleteButton showStatus/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {<ProgramTable data={programData.history} />}
          </div>
        )}
      </div>
    </motion.section>
  );
}
