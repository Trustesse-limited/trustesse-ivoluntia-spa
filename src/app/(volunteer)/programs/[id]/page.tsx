"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers, FiTarget, FiClock } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import { programs } from "@/lib/mockData";

export default function ProgramDetailPage() {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { id } = useParams();
  const program = programs.find((_, index) => index.toString() === id);

  if (!program) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Program Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {`The program you're looking for doesn't exist.`}
          </p>
          <BackButton />
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    setIsEnrolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsEnrolling(false);
    router.push("/volunteer/programs?enrolled=true");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-start gap-4 mb-4">
              <BackButton />
              <h1 className="text-3xl font-bold text-gray-900">
                {program.title}
              </h1>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {program.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="px-6 py-3 bg-[#66BB6A] text-white rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnrolling ? "Enrolling..." : "Enroll Now"}
            </button>
            <button
              onClick={() => router.push("/volunteer/programs")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Back to Programs
            </button>
          </div>
        </div>
      </div>

      {/* Program Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Program Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Program Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiCalendar className="text-[#0E68DC] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Duration</p>
                  <p className="text-gray-600">
                    {program.startDate} - {program.endDate}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#0E68DC] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{program.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiUsers className="text-[#0E68DC] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Target Volunteers</p>
                  <p className="text-gray-600">
                    {program.volunteers ?? "Unlimited"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiTarget className="text-[#0E68DC] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Donation Target</p>
                  <p className="text-gray-600">
                    ${program.donationTarget.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="text-[#0E68DC] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Time Commitment</p>
                  <p className="text-gray-600">Flexible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#0E68DC] mt-1">•</span>
                <span>Must be at least 18 years old</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0E68DC] mt-1">•</span>
                <span>Complete background check</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0E68DC] mt-1">•</span>
                <span>Attend orientation session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0E68DC] mt-1">•</span>
                <span>Commit to minimum hours per week</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Program Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    program.status === "active"
                      ? "bg-green-100 text-green-800"
                      : program.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {program.status.charAt(0).toUpperCase() +
                    program.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Spots Available</span>
                <span className="font-medium">25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">3 months</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Contact Information
            </h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> volunteer@example.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Coordinator:</strong> Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
