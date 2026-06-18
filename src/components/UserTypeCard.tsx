import React from 'react';

interface UserTypeCardProps {
  children: React.ReactNode;
}

export default function UserTypeCard({ children }: UserTypeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
      {children}
    </div>
  );
}
