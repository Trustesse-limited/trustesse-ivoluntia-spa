"use client";
import React from "react";
import BackButton from "@/components/BackButton";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='font-openSans min-h-screen flex flex-col justify-center items-center relative px-6 w-full'>
      <div className="absolute top-0 left-0 z-20 p-4 sm:p-6 md:p-8">
        <BackButton />
      </div>
      {children}
    </div>
  );
}


