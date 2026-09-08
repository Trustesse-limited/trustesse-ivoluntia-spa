"use client";

import Modal from "./Modal";
import { AppButton } from "./AppButton";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
};

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading }: LogoutModalProps) {
  const handleLogout = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-4 px-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Are you sure you want to log out?</h2>
        <p className="text-base text-gray-600 mb-8">This will clear all your data and redirect you to the login screen.</p>
        
        <div className="flex gap-4 justify-center">
          <AppButton
            text="Cancel"
            onClick={onClose}
            disabled={isLoading}
            className="!bg-gray-200 hover:!bg-gray-300 !text-gray-800 !py-3 !px-8 !rounded-xl !text-base !font-medium"
          />
          <AppButton
            text="Logout"
            isLoading={isLoading}
            onClick={handleLogout}
            className="!bg-red-600 hover:!bg-red-700 !py-3 !px-8 !rounded-xl !text-base !font-medium"
          />
        </div>
      </div>
    </Modal>
  );
}