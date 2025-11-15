"use client";
import Modal from "@/components/Modal";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";

type DonorCommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  donorName: string;
  profilePic: string;
  amount: number;
  location: string;
  comment: string;
};

export default function DonorCommentModal({
  isOpen,
  onClose,
  donorName,
  profilePic,
  amount,
  location,
  comment,
}: DonorCommentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        {/* Profile Picture */}
        <Image
          src={"/images/donor.png"}
          alt={donorName}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        {/* Name */}
        <h2 className="text-lg font-medium text-black">{donorName}</h2>
        {/* Amount */}
        <h2 className="text-sm text-[#818181]">₦{amount.toLocaleString()}</h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-[#818181]">
          <FiMapPin className="text-gray-500" />
          <span>{location}</span>
        </div>

        {/* Comment */}
        <p className="italic text-sm text-black px-4 max-w-md">“{comment}”</p>
      </div>
    </Modal>
  );
}
