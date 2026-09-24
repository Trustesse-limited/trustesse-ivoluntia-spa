import React from 'react';

interface UserTypeCardProps {
  children: React.ReactNode;
}

export default function UserTypeCard({ children }: UserTypeCardProps) {
  return (
    <div className="bg-white border border-[#C0C0C0] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer aspect-[5/4] w-full h-full">
      {children}
    </div>
  );
}
