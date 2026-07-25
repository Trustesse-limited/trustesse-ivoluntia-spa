import React from "react";


interface UserTypeCardProps {
  children: React.ReactNode;
}

const UserTypeCard = ({ children }: UserTypeCardProps) => {
  return (
    <div className="flex justify-center items-center flex-col border border-[#C0C0C0] rounded-xl w-32 sm:w-40 md:w-48 lg:w-56 xl:w-72 min-w-[120px] max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] sm:mt-12 py-6 sm:py-8 md:py-10 hover:shadow-xl cursor-pointer transition-all duration-300 hover:border-blue-400 bg-white relative flex-shrink-0">
      {children}
    </div>
  );
};

export default UserTypeCard;
