import React from "react";


interface UserTypeCardProps {
  children: React.ReactNode;
}

const UserTypeCard = ({ children }: UserTypeCardProps) => {
  return (
    <div className=" flex justify-center items-center flex-col border-[#C0C0C0] border-[1px] rounded-[12px] w-40 sm:w-[300px] mt-[75px] py-[36px] hover:shadow-lg cursor-pointer text">
      {children}
    </div>
  );
};

export default UserTypeCard;
