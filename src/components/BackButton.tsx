"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import { RippleEffect } from "./RippleEffect";

interface BackButtonProps {
  text?: string;
  className?: string;
  to?: string; // Custom navigation path. If provided, navigates to this path instead of going back
}

export default function BackButton({ text = "Back", className = "", to }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <RippleEffect
      onClick={handleBack}
      className={`flex items-center gap-2 px-2 sm:px-4 py-2 bg-gray-100 cursor-pointer rounded-md text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <div className="relative z-10 w-full h-full inline-flex items-center">
        <FiChevronLeft className="text-lg" />
        <span className="hidden sm:inline text-sm font-medium">{text}</span>
      </div>
    </RippleEffect>
  );
}
