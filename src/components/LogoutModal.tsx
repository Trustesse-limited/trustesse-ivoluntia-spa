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
    <Modal isOpen={isOpen} onClose={onClose} closeable={!isLoading}>
      <div className="text-center py-4 px-2 sm:px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Sign out of your account?</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">This will end your current session.</p>

        <div className="flex gap-3 sm:gap-4 justify-center">
          <AppButton
            text="Cancel"
            onClick={onClose}
            disabled={isLoading}
            variant="custom"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2! sm:py-3! px-6! sm:px-8! rounded-xl! text-sm! sm:text-base! font-medium! transition-colors duration-200"
          />
          <AppButton
            text="Logout"
            isLoading={isLoading}
            onClick={handleLogout}
            variant="custom"
            className="bg-red-500 hover:bg-red-600 text-white py-2! sm:py-3! px-6! sm:px-8! rounded-xl! text-sm! sm:text-base! font-medium! transition-colors duration-200"
          />
        </div>
      </div>
    </Modal>
  );
}