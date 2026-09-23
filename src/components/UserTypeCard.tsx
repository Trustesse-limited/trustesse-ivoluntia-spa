import React from 'react';

interface UserTypeCardProps {
  children: React.ReactNode;
}

export default function UserTypeCard({ children }: UserTypeCardProps) {
  return (
    <div className="bg-white border border-[#C0C0C0] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer flex-1 aspect-[5/4] min-w-[160px] max-w-[192px] sm:min-w-[240px] sm:max-w-[288px]">
      {children}
    </div>
  );
}
