"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";
import { programs } from "@/lib/mockData";

export default function CertificatePage() {
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
            The program you&apos;re looking for doesn&apos;t exist.
          </p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 overflow-hidden"
    >
      <div className="flex items-center justify-start gap-4 mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900">Certificate</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
        <div className="border-4 border-[#0E68DC] p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate of Completion</h2>
          <p className="text-lg text-gray-600 mb-6">This certifies that</p>
          <p className="text-2xl font-semibold text-gray-900 mb-6">Volunteer Name</p>
          <p className="text-lg text-gray-600 mb-4">has successfully completed</p>
          <p className="text-xl font-semibold text-[#0E68DC] mb-6">{program.title}</p>
          <p className="text-gray-600 mb-8">
            {program.startDate} - {program.endDate}
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Organization Signature</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Date</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
