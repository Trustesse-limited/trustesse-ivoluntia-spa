import React from 'react';

interface UserTypeCardProps {
  children: React.ReactNode;
}

export default function UserTypeCard({ children }: UserTypeCardProps) {
  return (
    <div className="bg-white border border-[#C0C0C0] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer flex-1  aspect-[5/4] w-48 h-40 sm:w-72 sm:h-60">
      {children}
    </div>
  );
}
