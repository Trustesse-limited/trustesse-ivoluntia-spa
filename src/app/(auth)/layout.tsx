"use client";
import React from "react";
import { usePathname } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // If on login page, navigate to root (/), otherwise use default back behavior
  const backTo = pathname === "/login" ? "/" : undefined;

  return (
    <div className='font-openSans min-h-screen relative w-full py-8'>
      <div className="absolute top-0 left-0 z-20 p-4 sm:p-6 md:p-8">
        <BackButton to={backTo} />
      </div>
      {children}
    </div>
  );
}


