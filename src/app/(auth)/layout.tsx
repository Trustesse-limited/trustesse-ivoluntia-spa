"use client";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
       
        
        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


