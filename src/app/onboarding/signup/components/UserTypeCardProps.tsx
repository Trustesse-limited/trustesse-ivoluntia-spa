import React from "react";


interface UserTypeCardProps {
  children: React.ReactNode;
}

const UserTypeCard = ({ children }: UserTypeCardProps) => {
  return (
    <div className="flex justify-center items-center flex-col border border-[#C0C0C0] rounded-xl w-40 sm:w-72  mt-8 sm:mt-12 py-8 sm:py-10 md:py-10 hover:shadow-xl cursor-pointer transition-all duration-300 hover:border-blue-400 bg-white">
      {children}
    </div>
  );
};

export default UserTypeCard;
