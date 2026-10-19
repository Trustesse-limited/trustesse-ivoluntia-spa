"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers, FiHeart } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import { getProgramByIdAction, joinProgramAction, leaveProgramAction } from "@/app/actions/auth";
import { ProgramItem } from "@/types";
import { ProgramApiResponse, ProgramGoal } from "@/types/api";
import toast from "react-hot-toast";
import ProgramDetailSkeleton from "@/components/ProgramDetailSkeleton";
import { formatProgramLocation, formatProgramDateRange, formatNumberWithCommas, normalizeProgramStatus } from "@/lib/utils";
import { AppButton } from "@/components/AppButton";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [programGoals, setProgramGoals] = useState<ProgramGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getProgramByIdAction(Array.isArray(id) ? id[0] : id);
        
        if (response.success && response.data) {
          const programData = response.data as ProgramApiResponse;
          const mappedProgram: ProgramItem = {
            id: programData.id || (Array.isArray(id) ? id[0] : id),
            title: programData.title || programData.name || '',
            startDate: programData.startDate || '',
            endDate: programData.endDate || '',
            location: formatProgramLocation(programData.location || programData.city),
            donationTarget: programData.donationTarget || programData.targetAmount || 0,
            raised: programData.raised || programData.raisedAmount || 0,
            category: programData.category || programData.foundationCategory || '',
            goals: programData.goals || '',
            description: programData.description || programData.mission || '',
            image: programData.image || programData.logo || '',
            volunteers: programData.volunteers || 0,
            status: normalizeProgramStatus(programData.status),
            organization: programData.organization || programData.organizationName || '',
            isFavourited: false,
            duration: programData.duration || '',
            targetVolunteers: programData.targetVolunteers || 0,
          };
          setProgram(mappedProgram);
          setProgramGoals(programData.programGoals || []);
        } else {
          setProgram(null);
          setProgramGoals([]);
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setProgram(null);
        setProgramGoals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (isLoading) {
    return <ProgramDetailSkeleton />;
  }

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
          <BackButton to="/home" />
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

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      const response = await joinProgramAction(program.id);
      
      if (response.success) {
        toast.success('Successfully joined the program!');
        setProgram(prev => prev ? { ...prev, volunteers: prev.volunteers + 1 } : null);
      } else {
        toast.error(response.error || 'Failed to join program');
      }
    } catch (error) {
      console.error('Error joining program:', error);
      toast.error('Failed to join program');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLeaving(true);
      const response = await leaveProgramAction(program.id);
      
      if (response.success) {
        toast.success('Successfully left the program');
        setProgram(prev => prev ? { ...prev, volunteers: Math.max(0, prev.volunteers - 1) } : null);
      } else {
        toast.error(response.error || 'Failed to leave program');
      }
    } catch (error) {
      console.error('Error leaving program:', error);
      toast.error('Failed to leave program');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleFavourite = () => {
    setIsFavourited(!isFavourited);
    toast.success(isFavourited ? 'Removed from favourites' : 'Added to favourites');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-4 bg-white text-black"
    >
      <div className="flex items-center justify-start gap-4">
        <BackButton to="/home" />
        <h1 className="text-xl font-bold">Program Details</h1> 
      </div>

      {/* Title and Actions */}
      <div className="flex items-center justify-between gap-6 w-full flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-bold">{program.title}</h2>
          <span
            className={`inline-block py-3 px-4 text-xs font-medium rounded-xl ${
              isActive()
                ? "bg-[#F3F3F3] text-[#66BB6A]"
                : "bg-[#F3F3F3] text-[#F7BA32]"
            }`}
          >
            {isActive() ? "Active" : "Pending"}
          </span>
        </div>
        <button
          onClick={handleFavourite}
          className="shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Add to favourites"
        >
          <FiHeart 
            className={`w-6 h-6 ${isFavourited ? 'fill-blue-500 text-blue-500' : 'text-blue-500'}`}
          />
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 gap-3 relative -top-4 text-sm text-[#373737]">
        <div className="font-medium text-base">{program.category}</div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-black" />
          {formatProgramDateRange(program.startDate, program.endDate)}
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
      {program.donationTarget > 0 && (
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
      )}

      {/* Goals */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Goals</h3>
        {programGoals.length > 0 ? (
          <div className="space-y-2">
            {programGoals.map((goal, index) => (
              <div key={goal.id || index} className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm">{goal.goal}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm rendered-list [&>ul]:list-disc pl-5">
            <div dangerouslySetInnerHTML={{ __html: program.goals }} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 w-full items-center">
        <AppButton
          text="Join Program"
          onClick={handleJoin}
          disabled={isJoining}
          className="py-3! px-8! rounded-xl! text-base! font-medium!"
        />
        <AppButton
          text="Leave Program"
          onClick={handleLeave}
          disabled={isLeaving}
          variant="outline"
          className="py-3! px-8! rounded-xl! text-base! font-medium!"
        />
      </div>
    </motion.section>
  );
}
