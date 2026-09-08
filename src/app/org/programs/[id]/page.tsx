"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import Modal from "@/components/Modal";
import { AppButton } from "@/components/AppButton";
import { programs } from "@/lib/mockData";

const formatNumberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ProgramDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const program = programs.find((_, index) => index.toString() === id);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForfeitModal, setShowForfeitModal] = useState(false);

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

  const handleDelete = () => {
    console.log("Program deleted");
    setShowDeleteModal(false);
  };

  const handleForfeit = () => {
    console.log("Program forfeited");
    setShowForfeitModal(false);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-full px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-4 bg-white text-black"
      >
        <div className="flex items-center justify-start gap-4">
          <BackButton />
          <h1 className="text-xl font-bold">Program Overview</h1> 
        </div>

        {/* Title */}
        <div className="flex items-center justify-start gap-6 w-full flex-wrap">
          <h2 className="text-xl font-bold">{program.title}</h2>
          <span
            className={`inline-block py-3 px-4 text-xs font-medium rounded-[8px] ${
              isActive()
                ? "bg-[#F3F3F3] text-[#66BB6A]"
                : "bg-[#F3F3F3] text-[#F7BA32]"
            }`}
          >
            {isActive() ? "Active" : "Pending"}
          </span>
          <AppButton
            text="Edit Program"
            onClick={() => router.push(`/org/programs/${id}/edit`)}
            className="!py-3 !px-6 !rounded-xl !text-sm !font-medium"
          />
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 gap-3 relative -top-4 text-sm text-[#373737]">
          <div className="font-medium text-base">{program.category}</div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-black" />
            {program.startDate} – {program.endDate}
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-black" />
            {program.location}
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-black" />
            {program.volunteers} Volunteers
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 lg:w-8/12">
          <h3 className="text-lg font-bold">Description</h3>
          <p className="text-sm whitespace-pre-line">{program.description}</p>
        </div>

        {/* Donation Target */}
        <div className="space-y-2 lg:w-8/12">
          <h3 className="text-lg font-bold">Donation Target</h3>
          <p className="text-sm mt-1">
            ${formatNumberWithCommas(program.raised)} Raised of $
            {formatNumberWithCommas(program.donationTarget)}
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
          <h3 className="text-lg font-bold">Goals</h3>
          <div className="text-sm rendered-list [&>ul]:list-disc pl-5">
            <div dangerouslySetInnerHTML={{ __html: program.goals }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 w-full items-center">
          <AppButton
            text="Forfeit"
            onClick={() => setShowForfeitModal(true)}
            variant="outline"
            className="!py-3 !px-8 !rounded-xl !text-base !font-medium"
          />
          <AppButton
            text="Delete"
            onClick={() => setShowDeleteModal(true)}
            variant="danger"
            className="!py-3 !px-8 !rounded-xl !text-base !font-medium"
          />
        </div>
      </motion.section>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Program
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this program? This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-center">
            <AppButton
              text="Cancel"
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="!py-3 !px-8 !rounded-xl !text-base !font-medium"
            />
            <AppButton
              text="Delete"
              onClick={handleDelete}
              variant="danger"
              className="!py-3 !px-8 !rounded-xl !text-base !font-medium"
            />
          </div>
        </div>
      </Modal>

      {/* Forfeit Modal */}
      <Modal isOpen={showForfeitModal} onClose={() => setShowForfeitModal(false)}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Forfeit Program
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to forfeit this program? This will mark it as forfeited and cannot be undone.
          </p>
          <div className="flex gap-4 justify-center">
            <AppButton
              text="Cancel"
              onClick={() => setShowForfeitModal(false)}
              variant="outline"
              className="!py-3 !px-8 !rounded-xl !text-base !font-medium"
            />
            <AppButton
              text="Forfeit"
              onClick={handleForfeit}
              variant="secondary"
              className="!py-3 !px-8 !rounded-xl !text-base !font-medium"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
