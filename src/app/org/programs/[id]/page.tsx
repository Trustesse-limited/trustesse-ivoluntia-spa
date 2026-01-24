"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { programs, volunteers } from "@/lib/mockData";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import Image from "next/image";
import { motion } from "framer-motion";
import ProgramNotFound from "../components/programNotFound";
import DeleteModal from "../components/modals/deleteProgram";
import ForfeitModal from "../components/modals/forfeitProgram";
import RemoveVolunteerModal from "../components/modals/removeVolunteer";
import VolunteerTable from "../../components/volunteersTable";
import { Volunteer } from "@/types";
import DonationsTable from "../../components/DonationsTable";
import { donors } from "@/lib/mockData";
import { Donor } from "@/types";
import DonorCommentModal from "../components/modals/DonorCommentModal";



export default function ProgramDetailPage() {
  const { id } = useParams();
  const program = programs.find((_, index) => index.toString() === id);
  const router = useRouter();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForfeitModal, setShowForfeitModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedVolunteerIndex, setSelectedVolunteerIndex] = useState<
    number | null
        >(null);
    const [showDonorCommentModal, setShowDonorCommentModal] = useState(false);
    const [selectedDonorIndex, setSelectedDonorIndex] = useState<number | null>(
      null
    );

    const handleViewDonorComment = (donor: Donor, index: number) => {
      setSelectedDonorIndex(index);
      setShowDonorCommentModal(true);
    };

    const handleCloseDonorCommentModal = () => {
      setShowDonorCommentModal(false);
      setSelectedDonorIndex(null);
    };


  if (!program) return <ProgramNotFound />;

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

  const handleRemoveVolunteer = (volunteer: Volunteer, index: number) => {
    setSelectedVolunteerIndex(index);
    setShowRemoveModal(true);
  };

  const confirmRemoveVolunteer = () => {
    if (selectedVolunteerIndex !== null) {
      console.log("Volunteer removed:", volunteers[selectedVolunteerIndex]);
    }
    setShowRemoveModal(false);
    setSelectedVolunteerIndex(null);
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
        <h1 className="text-xl font-bold">Program Overview</h1>

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
          <button onClick={()=>router.push("/org/programs/edit")} className="bg-[var(--buttonPrimary)] rounded-[8px] text-white text-sm font-medium ml-auto p-3 cursor-pointer hover:opacity-90 transition-class">
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
          <h3 className="text-lg font-bold">Goals</h3>
          <div className="text-sm rendered-list [&>ul]:list-disc pl-5">
            <div dangerouslySetInnerHTML={{ __html: program.goals }} />
          </div>
        </div>

        <div className="space-y-4 py-6">
          {/* Volunteer Table */}
          <h3 className="text-lg font-bold">Volunteers</h3>
          <VolunteerTable data={volunteers} onRemove={handleRemoveVolunteer} />
        </div>
        <div className="space-y-4 py-6">
          {/* Volunteer Table */}
          <h3 className="text-lg font-bold">Donations</h3>
          <DonationsTable
            data={donors}
            onViewComment={handleViewDonorComment}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 w-full items-center">
          <button
            onClick={() => setShowForfeitModal(true)}
            className="bg-[#C0C0C0] text-black text-sm font-medium rounded-[8px] py-3 px-8 cursor-pointer hover:opacity-90 transition"
          >
            Forfeit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-[#EF5350] text-white text-sm font-medium rounded-[8px] py-3 px-8 cursor-pointer hover:opacity-90 transition"
          >
            Delete
          </button>
        </div>
      </motion.section>

      {/* Modals */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
      <ForfeitModal
        isOpen={showForfeitModal}
        onClose={() => setShowForfeitModal(false)}
        onConfirm={handleForfeit}
      />
      <RemoveVolunteerModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={confirmRemoveVolunteer}
      />
      <DonorCommentModal
        isOpen={showDonorCommentModal}
        onClose={handleCloseDonorCommentModal}
        donorName={
          selectedDonorIndex !== null ? donors[selectedDonorIndex].name : ""
        }
        profilePic={
          selectedDonorIndex !== null
            ? donors[selectedDonorIndex].profilePic
            : ""
        }
        amount={
          selectedDonorIndex !== null ? donors[selectedDonorIndex].amount : 0
        }
        location={
          selectedDonorIndex !== null ? donors[selectedDonorIndex].location : ""
        }
        comment={
          selectedDonorIndex !== null ? donors[selectedDonorIndex].comment : ""
        }
      />
    </>
  );
}
