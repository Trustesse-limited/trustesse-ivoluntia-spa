"use client";

import React from "react";
import BackButton from "@/components/BackButton";

export default function ProgramDetailSkeleton() {
  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-4 bg-white text-black">
      <div className="flex items-center justify-start gap-4">
        <BackButton to="/home" />
        <div className="h-7 bg-shimmer animate-shimmer rounded-lg w-48" />
      </div>

      {/* Title and Actions */}
      <div className="flex items-center justify-between gap-6 w-full flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-6 bg-shimmer animate-shimmer rounded-lg w-64" />
          <div className="h-8 bg-shimmer animate-shimmer rounded-xl w-24" />
        </div>
        <div className="shrink-0 w-10 h-10 bg-shimmer animate-shimmer rounded-full" />
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 gap-3 relative -top-4 text-sm text-[#373737]">
        <div className="h-5 bg-shimmer animate-shimmer rounded-lg w-1/3" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-4 bg-shimmer animate-shimmer rounded w-48" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-4 bg-shimmer animate-shimmer rounded w-32" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-4 bg-shimmer animate-shimmer rounded w-28" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 lg:w-8/12">
        <div className="h-6 bg-shimmer animate-shimmer rounded-lg w-32" />
        <div className="space-y-2">
          <div className="h-4 bg-shimmer animate-shimmer rounded" />
          <div className="h-4 bg-shimmer animate-shimmer rounded" />
          <div className="h-4 bg-shimmer animate-shimmer rounded w-5/6" />
          <div className="h-4 bg-shimmer animate-shimmer rounded w-4/6" />
        </div>
      </div>

      {/* Donation Target */}
      <div className="space-y-2 lg:w-8/12">
        <div className="h-6 bg-shimmer animate-shimmer rounded-lg w-40" />
        <div className="h-4 bg-shimmer animate-shimmer rounded w-48 mt-1" />
        <div className="w-full bg-gray-200 rounded-full h-2" />
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <div className="h-6 bg-shimmer animate-shimmer rounded-lg w-24" />
        <div className="space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="h-4 bg-shimmer animate-shimmer rounded w-full" />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="h-4 bg-shimmer animate-shimmer rounded w-5/6" />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="h-4 bg-shimmer animate-shimmer rounded w-4/6" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 w-full items-center">
        <div className="h-12 bg-shimmer animate-shimmer rounded-xl w-40" />
        <div className="h-12 bg-shimmer animate-shimmer rounded-xl w-40" />
      </div>
    </div>
  );
}
