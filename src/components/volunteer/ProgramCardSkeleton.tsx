"use client";

import React from "react";

export default function ProgramCardSkeleton() {
  return (
    <div className="bg-white border border-black rounded-2xl p-4">
      {/* Header with favourite button */}
      <div className="flex justify-between items-start mb-3">
        {/* Title skeleton */}
        <div className="flex-1 mr-2 space-y-2">
          <div className="h-6 bg-shimmer animate-shimmer rounded-lg" />
          <div className="h-6 bg-shimmer animate-shimmer rounded-lg w-3/4" />
        </div>
        {/* Heart button skeleton */}
        <div className="shrink-0 w-7 h-7 bg-shimmer animate-shimmer rounded-full" />
      </div>

      {/* Organization name skeleton */}
      <div className="mb-3">
        <div className="h-5 bg-shimmer animate-shimmer rounded-lg w-1/2" />
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
          <div className="w-3 h-3 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-3 bg-shimmer animate-shimmer rounded w-16" />
        </div>
        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
          <div className="w-3 h-3 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-3 bg-shimmer animate-shimmer rounded w-20" />
        </div>
        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
          <div className="w-3 h-3 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-3 bg-shimmer animate-shimmer rounded w-14" />
        </div>
        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
          <div className="w-3 h-3 bg-shimmer animate-shimmer rounded-full" />
          <div className="h-3 bg-shimmer animate-shimmer rounded w-12" />
        </div>
      </div>

      {/* Progress Section skeleton */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="h-4 bg-shimmer animate-shimmer rounded w-1/3" />
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2" />
          <div className="mt-1">
            <div className="h-3 bg-shimmer animate-shimmer rounded w-1/4" />
          </div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="mb-4 space-y-2">
        <div className="h-4 bg-shimmer animate-shimmer rounded" />
        <div className="h-4 bg-shimmer animate-shimmer rounded w-5/6" />
      </div>

      {/* Learn More Button skeleton */}
      <div className="flex justify-center">
        <div className="h-9 bg-shimmer animate-shimmer rounded-md w-32" />
      </div>
    </div>
  );
}
