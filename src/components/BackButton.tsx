"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";

interface BackButtonProps {
  text?: string;
  className?: string;
}

export default function BackButton({ text = "Back", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-2 sm:px-4 py-2 bg-gray-100 cursor-pointer rounded-md text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <FiChevronLeft className="text-lg" />
      <span className="hidden sm:inline text-sm font-medium">{text}</span>
    </button>
  );
}
