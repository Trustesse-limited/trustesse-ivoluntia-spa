"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramItem } from "@/types";
import { FiHeart, FiMapPin, FiClock, FiUsers, FiDollarSign } from "react-icons/fi";
import { RippleEffect } from "@/components/RippleEffect";

type ProgramCardProps = {
  program: ProgramItem;
  index: number;
};

export default function ProgramCard({ program, index }: ProgramCardProps) {
  const router = useRouter();
  const [isFavourited, setIsFavourited] = useState(false);

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavourited(!isFavourited);
  };

  const handleLearnMore = () => {
    router.push(`/programs/${index}`);
  };

  const getProgressPercentage = () => {
    if (program.donationTarget === 0) return 0;
    return Math.min((program.raised / program.donationTarget) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <RippleEffect onClick={handleLearnMore} className="bg-white border border-black rounded-[16px] p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {/* Header with favourite button */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-black flex-1 mr-2">
          {program.title}
        </h3>
        <button
          onClick={handleFavourite}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Add to favourites"
        >
          <FiHeart 
            className={`w-5 h-5 ${isFavourited ? 'fill-blue-500 text-blue-500' : 'text-blue-500'}`}
          />
        </button>
      </div>

      {/* Organization name */}
      <div className="mb-3">
        <p className="text-sm text-black font-medium">
          {program.category.charAt(0).toUpperCase() + program.category.slice(1)} Organization
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
          <FiMapPin className="w-3 h-3" />
          <span>{program.location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
          <FiClock className="w-3 h-3" />
          <span>{program.startDate} - {program.endDate}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
          <FiUsers className="w-3 h-3" />
          <span>{program.volunteers} Volunteers</span>
        </div>
        {program.donationTarget > 0 && (
          <div className="flex items-center gap-1 text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
            <FiDollarSign className="w-3 h-3" />
            <span>Donation</span>
          </div>
        )}
      </div>

      {/* Progress Section */}
      {program.donationTarget > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-black font-medium">Goal: {formatCurrency(program.donationTarget)}</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#559C58] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="mt-1">
              <span className="text-xs text-black">
                Raised: {formatCurrency(program.raised)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-black line-clamp-2">
          {program.description}
        </p>
      </div>

      {/* Learn More Button */}
      <div className="flex justify-center">
        <button
          onClick={handleLearnMore}
          className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm"
        >
          Learn More
        </button>
      </div>
    </RippleEffect>
  );
}
