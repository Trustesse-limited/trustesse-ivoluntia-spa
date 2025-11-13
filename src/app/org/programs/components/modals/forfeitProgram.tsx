"use client";
import Modal from "@/components/Modal";
import Image from "next/image";

type ForfeitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ForfeitModal({
  isOpen,
  onClose,
  onConfirm,
}: ForfeitModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/warning-triangle-yellow.svg"
            alt="Warning"
            width={20}
            height={20}
            className="object-contain"
          />
          <h2 className="text-base font-semibold text-black">
            Forfeit Program?
          </h2>
        </div>

        {/* Illustration */}
        <Image
          src="/illustrations/forfeit.svg"
          alt="Forfeit Illustration"
          width={160}
          height={120}
          className="object-contain"
        />

        {/* Description */}
        <p className="text-sm sm:text-base">
          Are you sure you want to forfeit this program? This action will mark
          it as incomplete and remove it from active listings.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-8 py-2 border-2 border-[#C0C0C0] rounded-[8px] text-sm font-semibold hover:bg-gray-100 transition-class cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-[#C0C0C0] rounded text-sm font-semibold hover:opacity-90 transition-class cursor-pointer"
          >
            Forfeit
          </button>
        </div>
      </div>
    </Modal>
  );
}
